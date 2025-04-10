import {
  ProductDbInputType,
  ProductType,
} from "@/features/products/product.types";
import { connectToDatabase } from "..";
import Product from "../model/product.model";
import { unstable_cache } from "next/cache";
import { CACHE, ERROR_MESSAGES, MAX_SEARCH_RESULT } from "@/constants";
import { Id, QueryFilter } from "@/types";
import {
  getProductBySlugQuerySchema,
  ProductDbInputSchema,
  ProductTypeSchema,
} from "@/features/products/product.validator";
import { z } from "zod";
import { NotFoundError } from "@/lib/error";
import { FilterQuery, ProjectionType } from "mongoose";
import { searchProductResultType } from "@/features/filter/filter.types";
import { searchProductResultSchema } from "@/features/filter/filter.validator";

const getAllProducts = unstable_cache(
  async () => {
    await connectToDatabase();
    const products = await Product.find().lean();

    const result = products.map((product) =>
      ProductTypeSchema.parse(product),
    ) as ProductType[];

    return result;
  },
  CACHE.PRODUCTS.ALL.KEY_PARTS,
  {
    tags: [CACHE.PRODUCTS.ALL.TAGS],
    revalidate: 3600,
  },
);

type QueryType = z.input<typeof ProductTypeSchema>;
const getProductByQuery = async (query: QueryFilter<QueryType>) => {
  await connectToDatabase();
  const products = await Product.find(query).lean();
  const result = products.map((product) => ProductTypeSchema.parse(product));
  return result;
};

const searchProductByQuery = async ({
  query,
  sortOptions = {},
  skip = 0,
  limit = MAX_SEARCH_RESULT,
}: {
  query: FilterQuery<ProductType>;
  sortOptions?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}) => {
  await connectToDatabase();
  const result = await Product.aggregate([
    { $match: query },
    {
      $facet: {
        total: [{ $count: "count" }],
        products: [{ $sort: sortOptions }, { $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const products: ProductType[] = result[0].products.map(
    ProductTypeSchema.parse,
  );

  const total: number = result[0].total[0]?.count || 0;

  return {
    products,
    total,
  };
};

const searchProductAndSimpleReturnByQuery = async ({
  query,
  limit = MAX_SEARCH_RESULT,
}: {
  query: FilterQuery<ProductType>;
  limit?: number;
}) => {
  await connectToDatabase();
  const result = await Product.aggregate([
    { $match: { ...query } },
    {
      $facet: {
        products: [
          {
            $project: {
              _id: 1,
              name: 1,
              slug: 1,
              "category.slug": 1,
              image: {
                $arrayElemAt: [
                  {
                    $ifNull: [{ $arrayElemAt: ["$variants.images", 0] }, []],
                  },
                  0,
                ],
              },
              price: {
                $ifNull: [{ $arrayElemAt: ["$variants.price", 0] }, 0],
              },
            },
          },
          { $limit: limit },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const products: searchProductResultType[] = result[0].products.map(
    searchProductResultSchema.parse,
  );
  const total: number = result[0].total[0]?.count || 0;

  return { result: products, total };
};

const getProductsByQueryAndProjection = async ({
  query,
  projection,
  isPublished = true,
  limit = 20,
}: {
  query: FilterQuery<ProductType>;
  projection?: ProjectionType<ProductType>;
  limit?: number;
  isPublished?: boolean;
}) => {
  await connectToDatabase();
  const products = await Product.find({ ...query, isPublished }, projection)
    .limit(limit)
    .lean();

  return products;
};

const getProductByTags = async (tags: string[]) => {
  await connectToDatabase();
  const products = await Product.find({ "tags.name": { $in: tags } }).lean();
  const result = products.map((product) => ProductTypeSchema.parse(product));
  return result;
};

const getProductBySlug = async (
  input: z.infer<typeof getProductBySlugQuerySchema>,
) => {
  await connectToDatabase();
  const result = await Product.findOne({
    slug: input.productSlug,
  });

  const product = result ? ProductTypeSchema.parse(result) : null;
  return product;
};

const getProductById = async (id: Id) => {
  await connectToDatabase();
  const result = await Product.findById(id).lean();
  const product = ProductTypeSchema.parse(result);
  return product;
};

const getCountInStockOfVariant = async (input: {
  productId: string;
  variantId: string;
}) => {
  await connectToDatabase();
  const result = await Product.findOne(
    {
      _id: input.productId,
      "variants.uniqueId": input.variantId,
    },
    {
      "variants.$": 1, // get first item
      _id: 0,
    },
  );
  return result?.variants?.[0].countInStock;
};

const createProduct = async (input: ProductDbInputType) => {
  await connectToDatabase();
  const result = await Product.create(input);
  return result._id.toString();
};

const createProducts = async (input: ProductDbInputType[]) => {
  await connectToDatabase();
  const result = await Product.create(input);
  return result.map((item) => item._id.toString());
};

const updateProduct = async (
  input: z.input<typeof ProductDbInputSchema> & { id: string },
) => {
  await connectToDatabase();
  // todo: check product exist
  const result = await Product.findOneAndUpdate(
    { _id: input.id },
    {
      $set: input,
    },
    {
      new: true,
    },
  );
  if (!result) {
    // todo: this error is not true, check if product exist before update
    throw new NotFoundError({
      resource: "product",
      message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
    });
  }
};

const updateRating = async ({
  productId,
  rating,
}: {
  productId: Id;
  rating: number;
}) => {
  await connectToDatabase();

  const result = await Product.updateOne({ _id: productId }, [
    {
      $set: {
        totalReviews: { $add: ["$totalReviews", 1] }, // Tăng totalReviews trước
        avgRating: {
          $divide: [
            {
              $add: [{ $multiply: ["$totalReviews", "$avgRating"] }, rating],
            },
            { $add: ["$totalReviews", 1] }, // Chia cho totalReviews mới
          ],
        },
      },
    },
  ]);

  if (!result) {
    throw new NotFoundError({
      resource: "product",
      message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
    });
  }
};

const deleteProduct = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const count = await Product.countDocuments({ _id: { $in: idsArray } });

  if (count !== idsArray.length) {
    throw new NotFoundError({
      resource: "product",
      message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
    });
  }
  await Product.deleteMany({ _id: { $in: idsArray } });

  return ids;
};

const deleteFakeProducts = async () => {
  await connectToDatabase();
  await Product.deleteMany({
    name: { $regex: /^test/, $options: "i" }, // "i" để không phân biệt hoa thường
  });
};

const productRepository = {
  getAllProducts,
  getProductById,
  getProductByTags,
  getProductBySlug,
  getProductByQuery,
  getProductsByQueryAndProjection,
  getCountInStockOfVariant,
  createProduct,
  createProducts,
  updateProduct,
  updateRating,
  deleteProduct,
  deleteFakeProducts,
  searchProductByQuery,
  searchProductAndSimpleReturnByQuery,
};

export default productRepository;

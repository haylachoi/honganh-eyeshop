import {
  ProductDbInputType,
  ProductType,
} from "@/features/products/product.types";
import { connectToDatabase } from "..";
import Product from "../model/product.model";
import { MAX_SEARCH_RESULT } from "@/constants";
import { ERROR_MESSAGES } from "@/constants/messages.constants";
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

const getAllProducts = async () => {
  await connectToDatabase();
  const products = await Product.find().lean();

  const result = products.map((product) =>
    ProductTypeSchema.parse(product),
  ) as ProductType[];

  return result;
};

type QueryType = z.input<typeof ProductTypeSchema>;
const getProductByQuery = async (query: QueryFilter<QueryType>) => {
  await connectToDatabase();
  const products = await Product.find(query).lean();
  const result = products.map((product) => ProductTypeSchema.parse(product));
  return result;
};

const getPublishedProductsForEachCategory = async () => {
  await connectToDatabase();
  const categoryWithProducts = await Product.aggregate([
    {
      $match: { isPublished: true, isAvailable: true },
    },
    {
      $group: {
        _id: "$category._id",
        category: { $first: "$category" },
        products: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        category: 1,
        products: { $slice: ["$products", 6] },
      },
    },
  ]);

  const result = categoryWithProducts.map((categoryWithProduct) => ({
    id: categoryWithProduct._id.toString(),
    category: {
      id: categoryWithProduct.category._id.toString(),
      name: categoryWithProduct.category.name,
      slug: categoryWithProduct.category.slug,
    },
    products: ProductTypeSchema.array().parse(categoryWithProduct.products),
  }));

  return result;
};

const getProductByIds = async ({ ids }: { ids: string[] }) => {
  await connectToDatabase();
  const products = await Product.find({ _id: { $in: ids } }).lean();
  const result = ProductTypeSchema.array().parse(products);
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
  queries,
  limit = MAX_SEARCH_RESULT,
  includePrivateProduct = true,
}: {
  queries: FilterQuery<ProductType>[];
  includePrivateProduct: boolean;
  limit?: number;
}) => {
  await connectToDatabase();

  if (!includePrivateProduct) {
    queries.push({
      isPublished: true,
    });
  }

  const result = await Product.aggregate([
    ...queries.map((query) => ({ $match: query })),
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

const getProductByTags = async ({
  tags,
  limit,
  includePrivateProducts = false,
  skip = 0,
}: {
  tags: string[];
  limit: number;
  includePrivateProducts?: boolean;
  skip?: number;
}) => {
  await connectToDatabase();

  const match: FilterQuery<ProductType> = {
    "tags.name": { $in: tags },
  };

  if (!includePrivateProducts) {
    match.isPublished = true;
  }

  const result = await Product.aggregate([
    { $match: match },
    {
      $facet: {
        total: [{ $count: "count" }],
        products: [
          { $sort: { updatedAt: 1 } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    },
  ]);

  const products: ProductType[] = result[0].products.map(
    ProductTypeSchema.parse,
  );
  const total: number = result[0].total[0]?.count || 0;

  return { products, total };
};

const getProductBySlug = async ({
  input,
  includePrivateProduct = false,
}: {
  input: z.infer<typeof getProductBySlugQuerySchema>;
  includePrivateProduct?: boolean;
}) => {
  await connectToDatabase();
  const query: FilterQuery<ProductType> = { slug: input.productSlug };
  if (!includePrivateProduct) {
    query.isPublished = true;
  }
  const result = await Product.findOne(query);

  const product = result ? ProductTypeSchema.parse(result) : null;
  return product;
};

const getProductById = async ({
  id,
  includePrivateProduct = false,
}: {
  id: Id;
  includePrivateProduct?: boolean;
}) => {
  await connectToDatabase();
  const query: FilterQuery<ProductType> = { _id: id };
  if (!includePrivateProduct) {
    query.isPublished = true;
  }
  const result = await Product.find(query).lean();
  const product = ProductTypeSchema.parse(result[0]);
  return product;
};

const getCountInStockOfVariant = async (input: {
  productId: string;
  variantId: string;
  includePrivateProduct?: boolean;
}) => {
  await connectToDatabase();
  const query: FilterQuery<ProductType> = {
    _id: input.productId,
    "variants.uniqueId": input.variantId,
  };

  if (!input.includePrivateProduct) {
    query.isPublished = true;
  }

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
  console.log(input);
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
  input: z.infer<typeof ProductDbInputSchema> & { id: string },
) => {
  const { id, ...updateData } = input;

  await connectToDatabase();

  const updated = await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true },
  );

  if (!updated) {
    throw new NotFoundError({
      resource: "product",
      message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
    });
  }

  return updated;
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
  getProductByIds,
  getPublishedProductsForEachCategory,
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

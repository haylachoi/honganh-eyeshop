import { ProductType } from "@/features/products/product.types";
import { connectToDatabase } from "..";
import Product from "../model/product.model";
import { unstable_cache } from "next/cache";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import { AppError, Id } from "@/types";
import {
  getProductBySlugQuerySchema,
  ProductServerInputSchema,
  ProductTypeSchema,
} from "@/features/products/product.validator";
import { z } from "zod";

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

  if (!result) {
    throw new AppError({
      message: ERROR_MESSAGES.NOT_FOUND.SLUG.SINGLE,
    });
  }

  const product = ProductTypeSchema.parse(result);
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

const createProduct = async (
  input: z.input<typeof ProductServerInputSchema>,
) => {
  await connectToDatabase();
  const result = await Product.create(input);
  return result._id.toString();
};

const updateProduct = async (
  input: z.input<typeof ProductServerInputSchema> & { id: string },
) => {
  await connectToDatabase();
  const result = await Product.findOneAndUpdate({ _id: input.id }, input, {
    new: true,
  });
  if (!result) {
    throw new AppError({ message: ERROR_MESSAGES.NOT_FOUND.ID.SINGLE });
  }
};

const deleteProduct = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const count = await Product.countDocuments({ _id: { $in: idsArray } });

  if (count !== idsArray.length) {
    throw new AppError({ message: ERROR_MESSAGES.NOT_FOUND.ID.MULTIPLE });
  }
  await Product.deleteMany({ _id: { $in: idsArray } });

  return ids;
};

const productRepository = {
  getAllProducts,
  getProductById,
  getProductByTags,
  getProductBySlug,
  getCountInStockOfVariant,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productRepository;

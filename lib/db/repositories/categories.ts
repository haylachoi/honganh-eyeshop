"server only";

import { unstable_cache } from "next/cache";
import { connectToDatabase } from "..";
import Category from "@/lib/db/model/category.model";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import { Id } from "@/types";
import {
  CategoryType,
  CategoryUpdateType,
  CategoryInputType,
} from "@/features/categories/category.types";
import { CategoryTypeSchema } from "@/features/categories/category.validator";
import mongoose from "mongoose";
import Product from "../model/product.model";
import { NotFoundError } from "@/lib/error";

// const getCategories = async () => {
//   await connectToDatabase();
//   const categories = await Category.find().sort({ name: -1 }).lean();
//
//   const result = categories.map((category) => ({
//     ...category,
//     _id: category._id.toString(),
//   })) as CategoryType[];
//
//   return result;
// };

const getAllCategories = unstable_cache(
  async () => {
    await connectToDatabase();
    const categories = await Category.find().lean();

    const result = categories.map(({ _id, ...category }) => ({
      ...category,
      id: _id.toString(),
    })) as CategoryType[];

    return result;
  },
  CACHE.CATEGORIES.ALL.KEY_PARTS,
  {
    tags: [CACHE.CATEGORIES.ALL.TAGS],
    revalidate: 3600,
  },
);

const getCategoryById = async (id: Id) => {
  await connectToDatabase();
  const result = await Category.findById(id).lean();
  const category = CategoryTypeSchema.parse(result);
  return category;
};

const getCategoryBySlug = async (slug: string) => {
  await connectToDatabase();
  const result = await Category.findOne({ slug }).lean();
  const category = CategoryTypeSchema.parse(result);
  return category;
};

const createCategory = async (input: CategoryInputType) => {
  await connectToDatabase();
  const result = await Category.create(input);
  const category = CategoryTypeSchema.parse(result);
  return category;
};

const updateCategory = async (category: CategoryUpdateType) => {
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await Category.findOneAndUpdate(
      { _id: category.id },
      category,
      {
        new: true,
        session,
      },
    );

    if (!result) {
      throw new NotFoundError({
        resource: "category",
        message: ERROR_MESSAGES.CATEGORY.NOT_FOUND,
      });
    }

    await Product.updateMany(
      { "category._id": category.id },
      {
        $set: {
          "category.name": category.name,
          "category.slug": category.slug,
        },
      },
      {
        session,
      },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteCategory = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const count = await Category.countDocuments({ _id: { $in: idsArray } });

  if (count !== idsArray.length) {
    throw new NotFoundError({
      resource: "category",
      message: ERROR_MESSAGES.CATEGORY.NOT_FOUND,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Category.deleteMany({ _id: { $in: idsArray } }, { session });
    await Product.deleteMany(
      { "category._id": { $in: idsArray } },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return ids;
};

const categoriesRepository = {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoriesRepository;

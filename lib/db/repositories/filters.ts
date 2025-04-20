import { connectToDatabase } from "..";
import Filter from "../model/filter.model";
import Product from "../model/product.model";
import Category from "../model/category.model";
import { filterGroupSchema } from "@/features/filter/filter.validator";

const getAllFilters = async () => {
  await connectToDatabase();
  const filter = await Filter.find().lean();

  const result = filterGroupSchema.array().parse(filter);
  return result;
};

const getFilterByCategoryId = async (categoryId: string) => {
  await connectToDatabase();
  const filter = await Filter.find({ categoryId }).lean();

  const result = filterGroupSchema.array().parse(filter);

  return result;
};

const getFilterByCategorySlug = async (categorySlug: string) => {
  await connectToDatabase();
  const filter = await Filter.find({ categorySlug }).lean();

  const result = filterGroupSchema.array().parse(filter);

  return result;
};

export const createFilter = async () => {
  await connectToDatabase();
  const categories = await Category.find().lean();

  const results = await Promise.all(
    categories.map((category) =>
      Product.aggregate([
        {
          $match: { "category._id": category._id },
        },
        {
          $unwind: "$attributes",
        },
        {
          $group: {
            _id: {
              name: "$attributes.name",
              displayName: "$attributes.displayName",
              categoryId: "$category._id",
              categorySlug: "$category.slug",
            },
            values: {
              $addToSet: {
                value: "$attributes.value",
                valueSlug: "$attributes.valueSlug", // Lấy valueSlug từ attributes
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            categoryId: "$_id.categoryId",
            categorySlug: "$_id.categorySlug",
            name: "$_id.name",
            displayName: "$_id.displayName",
            values: 1,
          },
        },
      ]),
    ),
  );

  const input = results.flat();
  await Filter.deleteMany({});
  await Filter.insertMany(input);
};

const filtersRepository = {
  getAllFilters,
  getFilterByCategoryId,
  getFilterByCategorySlug,
  createFilter,
};

export default filtersRepository;

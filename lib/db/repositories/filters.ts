import { connectToDatabase } from "..";
import Filter from "../model/filter.model";
import Product from "../model/product.model";
import Category from "../model/category.model";
import { filterGroupSchema } from "@/features/filter/filter.validator";

const getGlobalFilters = async () => {
  await connectToDatabase();
  const filter = await Filter.find({
    categoryId: { $exists: false },
  }).lean();

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

  const perCategoryResults = await Promise.all(
    categories.map((category) =>
      Product.aggregate([
        { $match: { "category._id": category._id } },
        { $unwind: "$attributes" },
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
                valueSlug: "$attributes.valueSlug",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            displayName: "$_id.displayName",
            categoryId: "$_id.categoryId",
            categorySlug: "$_id.categorySlug",
            values: 1,
          },
        },
      ]),
    ),
  );

  const globalResults = await Product.aggregate([
    { $unwind: "$attributes" },
    {
      $group: {
        _id: {
          name: "$attributes.name",
          displayName: "$attributes.displayName",
        },
        values: {
          $addToSet: {
            value: "$attributes.value",
            valueSlug: "$attributes.valueSlug",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        displayName: "$_id.displayName",
        values: 1,
      },
    },
  ]);

  const input = [...perCategoryResults.flat(), ...globalResults];

  await Filter.deleteMany({});
  await Filter.insertMany(input);
};

const filtersRepository = {
  getGlobalFilters,
  getFilterByCategoryId,
  getFilterByCategorySlug,
  createFilter,
};

export default filtersRepository;

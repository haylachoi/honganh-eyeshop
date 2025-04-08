import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { categorySlugSchema } from "../categories/category.validator";

const filterNameSchema = z.string();
const filterValueSchema = z.object({
  value: z.string(),
  valueSlug: z.string(),
});

export const filterGroupSchema = z.object({
  name: filterNameSchema,
  values: z.array(filterValueSchema),
});

export const filterInputSchema = z.object({
  categoryId: IdSchema,
  categorySlug: categorySlugSchema,
  name: filterNameSchema,
  values: z.array(filterValueSchema),
});

export const filterTypeSchema = filterInputSchema
  .extend({
    _id: MongoIdSchema,
    categoryId: MongoIdSchema,
  })
  .transform(({ _id, categoryId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    categoryId: categoryId.toString(),
  }));

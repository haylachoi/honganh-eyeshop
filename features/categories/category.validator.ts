import { z } from "zod";
import { IdSchema, MongoIdSchema } from "@/lib/validator";

export const categorySlugSchema = z.string().min(1, "Slug is required");
export const attributeNameSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Chỉ chứa chữ thường, số và dấu gạch ngang.",
  );
export const attributeDisplayNameSchema = z.string().min(1);
const updatedAtSchema = z.date();

export const CategoryInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: categorySlugSchema,
  description: z.string().optional(),
  attributes: z.array(
    z.object({
      name: attributeNameSchema,
      display: attributeDisplayNameSchema,
      defaultValue: z.string().optional(),
    }),
  ),
});

export const CategoryTypeSchema = CategoryInputSchema.extend({
  _id: MongoIdSchema,
  updatedAt: updatedAtSchema,
})
  .strip()
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const CategoryUpdateSchema = CategoryInputSchema.extend({
  id: IdSchema,
});

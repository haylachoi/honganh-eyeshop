import { MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

// export const TagSchema = z.object({
//   name: z.string().min(1, "Tag name must be at least 1 character"),
// });

const nameSchema = z
  .string()
  .min(1, "Tag name must be at least 1 character")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Chỉ chứa chữ thường, số và dấu gạch ngang.",
  });

export const tagInputSchema = z.object({
  name: nameSchema,
});
export const tagUpdateSchema = z.object({
  id: z.string(),
  name: nameSchema,
});

export const tagTypeSchema = z
  .object({
    _id: MongoIdSchema,
    name: nameSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

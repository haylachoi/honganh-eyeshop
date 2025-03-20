import { MoneySchema, IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters");
const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters");
const brandSchema = z.string().trim().min(1, "Brand is required");
const descriptionSchema = z.string().trim().optional();
const isPublishedSchema = z.boolean().default(true);
const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const imageSchema = z.instanceof(File);

const variantSchema = z.object({
  // images: z.unknown().transform((value) => {
  //   return value as FileList;
  // }),
  images: z.array(imageSchema),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1).trim(),
        value: z.string().min(1).trim(),
      }),
    )
    .min(1, "Variant must have at least one attribute"),
  price: MoneySchema,
  originPrice: MoneySchema,
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("count in stock must be a non-negative number"),
});

const variantUpdateSchema = variantSchema.extend({
  deletedImages: z.array(z.string()).default([]),
  oldImages: z.array(z.string()).default([]),
});

const categorySchema = z.string();
const attributeSchema = z.object({
  name: z.string().min(1).trim(),
  value: z.string().min(1).trim(),
});

const attributesSchema = z.array(attributeSchema);

export const ProductInputSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  category: categorySchema,
  attributes: attributesSchema,
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  tags: z.array(tagSchema),
  variants: z.array(variantSchema),
});

export const ProductServerInputSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  category: z.object({ _id: z.string(), name: z.string(), slug: z.string() }),
  attributes: attributesSchema,
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  tags: z.array(z.object({ _id: z.string(), name: z.string() })),
  variants: z.array(
    variantSchema
      .omit({ images: true })
      .extend({ images: z.array(z.string()) }),
  ),
});

export const productUpdateSchema = ProductInputSchema.omit({
  variants: true,
}).extend({
  id: IdSchema,
  variants: z.array(variantUpdateSchema),
});

export const ProductTypeSchema = z
  .object({
    _id: MongoIdSchema,
    name: nameSchema,
    slug: slugSchema,
    category: z
      .object({ _id: MongoIdSchema, name: z.string(), slug: z.string() })
      .transform(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      })),

    attributes: attributesSchema,
    brand: brandSchema,
    description: descriptionSchema,
    isPublished: isPublishedSchema,
    tags: z
      .array(z.object({ _id: MongoIdSchema, name: z.string() }))
      .transform((tag) =>
        tag.map(({ _id, ...rest }) => ({
          ...rest,
          id: _id.toString(),
        })),
      ),
    variants: z.array(
      variantSchema
        .omit({ images: true })
        .extend({ images: z.array(z.string()) }),
    ),
    avgRating: z.number().default(0),
    numReviews: z.number().default(0),
    // ratingDistribution: z.array(
    //   z.object({
    //     rating: z.number(),
    //     count: z.number(),
    //   }),
    // ),
    numSales: z.number().default(0),
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const getProductBySlugQuerySchema = z.object({
  categorySlug: z.string().optional(),
  productSlug: z.string(),
});

import { MoneySchema, IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import {
  attributeDisplayNameSchema,
  attributeNameSchema,
} from "../categories/category.validator";

// general
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
const isPublishedSchema = z.boolean();
const isAvailableSchema = z.boolean();
const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const updatedAtSchema = z.date();
const categorySchema = z.string();
const highestDiscountSchema = z.number().int().nonnegative();

const imageSchema = z.instanceof(File);

export const variantAttributeSchema = z.object({
  name: z.string().min(1).trim(),
  value: z.string().min(1).trim(),
});

export const attributeSchema = z.object({
  name: attributeNameSchema,
  displayName: attributeDisplayNameSchema,
  value: z.string().trim().optional().default(""),
  valueSlug: z.string().trim().optional().default(""),
});

// base
export const baseVariantSchema = z.object({
  // images: z.unknown().transform((value) => {
  //   return value as FileList;
  // }),
  uniqueId: z.string(),
  images: z.array(imageSchema),
  attributes: z
    .array(variantAttributeSchema)
    .min(1, "Variant must have at least one attribute"),
  price: MoneySchema,
  originPrice: MoneySchema,
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("count in stock must be a non-negative number"),
});

// update
const variantUpdateSchema = baseVariantSchema.extend({
  deletedImages: z.array(z.string()).default([]),
  oldImages: z.array(z.string()).default([]),
});

// main
export const baseProductSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  category: categorySchema,
  attributes: z.array(attributeSchema),
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  isAvailable: isAvailableSchema,
  tags: z.array(tagSchema),
});

export const ProductInputSchema = baseProductSchema
  .extend({
    variants: z.array(baseVariantSchema),
  })
  .refine(
    ({ isAvailable, isPublished }) => {
      return isPublished || !isAvailable;
    },
    {
      message: "Sản phẩm đang bán thì phải công khai",
      path: ["isAvailable"],
    },
  )
  .transform(({ attributes, ...rest }) => {
    return {
      ...rest,
      attributes: attributes.filter((attribute) => attribute.value.trim()),
    };
  });

export const ProductDbInputSchema = z.object({
  name: nameSchema,
  nameNoAccent: nameSchema,
  slug: slugSchema,
  category: z.object({ _id: IdSchema, name: z.string(), slug: z.string() }),
  attributes: z.array(attributeSchema),
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  isAvailable: isAvailableSchema,
  tags: z.array(z.object({ _id: z.string(), name: z.string() })),
  minPrice: MoneySchema,
  maxPrice: MoneySchema,
  highestDiscount: highestDiscountSchema,
  variants: z.array(
    baseVariantSchema
      .omit({ images: true })
      .extend({ images: z.array(z.string()) }),
  ),
});

export const productUpdateSchema = baseProductSchema
  .extend({
    id: IdSchema,
    variants: z.array(variantUpdateSchema),
  })
  .refine(
    ({ isAvailable, isPublished }) => {
      return isPublished || !isAvailable;
    },
    {
      message: "Sản phẩm đang bán thì phải công khai",
      path: ["isAvailable"],
    },
  )
  .transform(({ attributes, ...rest }) => {
    return {
      ...rest,
      attributes: attributes.filter((attribute) => attribute.value.trim()),
    };
  });

export const variantTypeSchema = baseVariantSchema
  .omit({ images: true })
  .extend({ images: z.array(z.string()) });

export const productTypeWithoutTransformSchema = z.object({
  _id: MongoIdSchema,
  name: nameSchema,
  nameNoAccent: nameSchema,
  slug: slugSchema,
  category: z
    .object({ _id: MongoIdSchema, name: z.string(), slug: z.string() })
    .transform(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    })),

  attributes: z.array(attributeSchema),
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  isAvailable: isAvailableSchema,
  tags: z
    .array(z.object({ _id: MongoIdSchema, name: z.string() }))
    .transform((tag) =>
      tag.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      })),
    ),
  minPrice: MoneySchema,
  maxPrice: MoneySchema,
  variants: z.array(variantTypeSchema),
  avgRating: z.number().default(0),
  highestDiscount: highestDiscountSchema.optional().default(0),
  rating: z
    .object({
      1: z.number().default(0),
      2: z.number().default(0),
      3: z.number().default(0),
      4: z.number().default(0),
      5: z.number().default(0),
    })
    .optional(),
  totalReviews: z.number().default(0),
  totalSales: z.number().default(0),
  updatedAt: updatedAtSchema,
});

export const ProductTypeSchema = productTypeWithoutTransformSchema.transform(
  ({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }),
);

export const getProductBySlugQuerySchema = z.object({
  categorySlug: z.string().optional(),
  productSlug: z.string(),
});

import { z } from "zod";

const imagesSchema = z.array(z.string()).default([]);
export const imageSourceSchema = z.object({
  fakeUrl: z.string(),
  file: z.instanceof(File),
});

export const supportPageUpdateSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  isPublished: z.boolean(),
  showFooter: z.boolean(),
  images: imagesSchema,
  imageSources: z.array(imageSourceSchema),
  deletedImages: imagesSchema,
});

export const supportPageTypeSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  isPublished: z.boolean(),
  showFooter: z.boolean(),
  images: imagesSchema,
});

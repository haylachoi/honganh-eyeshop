import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

const titleSchema = z.string().trim().min(3).max(200);
export const blogSlugSchema = z.string().trim().min(3).max(200);
const wallImageSchema = z.union([z.string(), z.instanceof(File)]);
const imagesSchema = z.array(z.string()).default([]);
export const imageSourceSchema = z.object({
  fakeUrl: z.string(),
  file: z.instanceof(File),
});

const tocSchema = z
  .array(
    z.object({
      id: z.string(),
      text: z.string(),
      level: z.number(),
    }),
  )
  .default([]);

const dateSchema = z.date();
const contentSchema = z.string();
const isPublishedSchema = z.boolean().default(true);
const authorSchema = z
  .object({
    _id: MongoIdSchema,
    name: z.string(),
  })
  .transform(({ _id, ...res }) => ({
    ...res,
    id: _id.toString(),
  }));

export const baseBlogInputSchema = z.object({
  title: titleSchema,
  slug: blogSlugSchema,
  wallImage: wallImageSchema,
  images: imagesSchema,
  authorId: IdSchema,
  content: contentSchema,
  isPublished: isPublishedSchema,
  toc: tocSchema,
});

export const blogInputSchema = baseBlogInputSchema.extend({
  imageSources: z.array(imageSourceSchema),
});
export const blogDbInputSchema = blogInputSchema
  .omit({ authorId: true, imageSources: true })
  .extend({
    titleNoAccent: titleSchema,
    author: z.object({
      _id: z.string(),
      name: z.string(),
    }),
  });

export const blogUpdateSchema = blogInputSchema.extend({
  id: IdSchema,
});

export const blogTypeSchema = blogInputSchema
  .omit({
    wallImage: true,
    authorId: true,
    imageSources: true,
  })
  .extend({
    _id: MongoIdSchema,
    author: authorSchema,
    titleNoAccent: titleSchema,
    wallImage: z.string(),
    updatedAt: dateSchema,
  })
  .transform(({ _id, ...res }) => ({
    ...res,
    id: _id.toString(),
  }));

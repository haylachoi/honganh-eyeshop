import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

const titleSchema = z.string().trim().min(3).max(200);
export const blogSlugSchema = z.string().trim().min(3).max(200);
const wallImageSchema = z.union([z.string(), z.instanceof(File)]);
const imagesSchema = z.array(z.string()).default([]);
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

export const blogInputSchema = z.object({
  title: titleSchema,
  slug: blogSlugSchema,
  wallImage: wallImageSchema,
  images: imagesSchema,
  authorId: IdSchema,
  date: dateSchema,
  content: contentSchema,
  isPublished: isPublishedSchema,
});

export const blogDbInputSchema = blogInputSchema
  .omit({ authorId: true })
  .extend({
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
  })
  .extend({
    _id: MongoIdSchema,
    author: authorSchema,
    wallImage: z.string().optional(),
  })
  .transform(({ _id, ...res }) => ({
    ...res,
    id: _id.toString(),
  }));

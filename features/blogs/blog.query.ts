import blogsRepository from "@/lib/db/repositories/blogs";
import { safeQuery } from "@/lib/query";
import { blogSlugSchema } from "./blog.validators";
import { IdSchema } from "@/lib/validator";

export const getAllBlogs = safeQuery.query(async () => {
  const blogs = await blogsRepository.getAllBlogs();
  return blogs;
});

export const getBlogById = safeQuery
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const blog = await blogsRepository.getBlogById(parsedInput);
    return blog;
  });

export const getBlogBySlug = safeQuery
  .schema(blogSlugSchema)
  .query(async ({ parsedInput }) => {
    const blog = await blogsRepository.getBlogBySlug(parsedInput);
    return blog;
  });

import blogsRepository from "@/lib/db/repositories/blogs";
import { safeQuery } from "@/lib/query";
import { blogSlugSchema } from "./blog.validators";

export const getAllBlogs = safeQuery.query(async () => {
  const blogs = await blogsRepository.getAllBlogs();
  return blogs;
});

export const getBlogBySlug = safeQuery
  .schema(blogSlugSchema)
  .query(async ({ inputParams }) => {
    const blog = await blogsRepository.getBlogBySlug(inputParams);
    return blog;
  });

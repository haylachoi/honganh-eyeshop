import { getAuthQueryClient, safeQuery } from "@/lib/query";
import { blogSlugSchema } from "./blog.validators";
import { IdSchema } from "@/lib/validator";
import { z } from "zod";
import {
  createBlogQueryFilter,
  createBlogSortingOptions,
} from "./blog.queries-builder";
import { PAGE_SIZE } from "@/constants";
import next_cache from "@/cache";

const resource = "blog";
const blogQueryClient = getAuthQueryClient({
  resource,
});

export const getAllBlogs = blogQueryClient.query(async () => {
  const blogs = await next_cache.blogs.all();
  return blogs;
});

export const getBlogById = blogQueryClient
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const blog = await next_cache.blogs.byId(parsedInput);
    return blog;
  });

export const getBlogBySlug = safeQuery
  .schema(blogSlugSchema)
  .query(async ({ parsedInput }) => {
    const blog = await next_cache.blogs.bySlug(parsedInput);
    return blog;
  });

export const getPublishedBlogsByTag = safeQuery
  .schema(
    z.object({
      tag: z.string(),
    }),
  )
  .query(async ({ parsedInput: { tag } }) => {
    const blogs = await next_cache.blogs.publishedBlogByTag({
      tag,
    });
    return blogs;
  });

export const getRecentPublishedBlogs = safeQuery.query(async () => {
  const blogs = await next_cache.blogs.recent();
  return blogs;
});

export const searchBlogsByQuery = safeQuery
  .schema(
    z.object({
      params: z.record(z.string()).optional(),
      page: z.number().min(1).default(1),
      size: z.number().min(1).max(100).default(PAGE_SIZE.BLOGS.SM),
      sortBy: z.string().optional(),
      orderBy: z.string().optional(),
    }),
  )
  .query(async ({ parsedInput: { params, page, size, sortBy, orderBy } }) => {
    const filterQuery = createBlogQueryFilter({ input: params });
    const sortOptions = createBlogSortingOptions({ sortBy, orderBy });

    const input = {
      filterQuery,
      limit: size,
      sortOptions,
      skip: (page - 1) * size,
    };
    const blogs = await next_cache.blogs.searchByQuery(input);

    return blogs;
  });

export const countBlogsByQuery = safeQuery
  .schema(
    z
      .object({
        params: z.record(z.string()),
      })
      .optional(),
  )
  .query(async ({ parsedInput }) => {
    const params = parsedInput?.params;
    const filterQuery = createBlogQueryFilter({ input: params });
    const count = await next_cache.blogs.countByQuery(filterQuery);

    return count;
  });

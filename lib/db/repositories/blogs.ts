import { BlogDbInputType, BlogType } from "@/features/blogs/blog.types";
import { connectToDatabase } from "..";
import Blog from "../model/blog.model";
import {
  CACHE,
  ERROR_MESSAGES,
  MAX_SEARCH_RESULT,
  PAGE_SIZE,
} from "@/constants";
import { unstable_cache } from "next/cache";
import { NotFoundError } from "@/lib/error";
import { FilterQuery, QueryOptions } from "mongoose";
import { searchBlogResultSchema } from "@/features/filter/filter.validator";
import { blogTypeSchema } from "@/features/blogs/blog.validators";
import { SearchBlogResultType } from "@/features/filter/filter.types";
import { RESOURCE_TYPES } from "@/features/authorization/authorization.constants";

const getAllBlogs = unstable_cache(
  async () => {
    await connectToDatabase();
    const blogs = await Blog.find().lean();

    const result = blogs.map((blog) => blogTypeSchema.parse(blog));

    return result;
  },
  CACHE.BLOGS.ALL.KEY_PARTS,
  {
    tags: [CACHE.BLOGS.ALL.TAGS],
    revalidate: 3600,
  },
);

const getBlogsByTags = async ({
  tags,
  limit = PAGE_SIZE.BLOGS.SM,
  skip = 0,
}: {
  tags?: string[];
  limit?: number;
  skip?: number;
} = {}) => {
  await connectToDatabase();
  const matchStage = tags ? { tags: { $in: tags } } : {};

  const result = await Blog.aggregate([
    { $match: matchStage },
    {
      $facet: {
        total: [{ $count: "count" }],
        items: [
          { $sort: { updatedAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    },
  ]);

  const items: BlogType[] = result[0].items.map(blogTypeSchema.parse);
  const total: number = result[0].total[0]?.count || 0;
  return { items, total };
};

const getRecentBlogs = unstable_cache(
  async ({ limit = PAGE_SIZE.BLOGS.SM, skip = 0 } = {}) => {
    await connectToDatabase();
    const blogs = await Blog.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const result = blogs.map((blog) => blogTypeSchema.parse(blog));

    return result;
  },
  CACHE.BLOGS.RECENT.KEY_PARTS,
  {
    tags: CACHE.BLOGS.RECENT.TAGS,
    revalidate: CACHE.BLOGS.RECENT.TIME,
  },
);

const getBlogById = async (id: string) => {
  await connectToDatabase();
  const result = await Blog.findById(id).lean();

  const blog = result ? blogTypeSchema.parse(result) : null;
  return blog;
};

const getBlogBySlug = async (slug: string) => {
  await connectToDatabase();
  const result = await Blog.findOne({ slug });
  const blog = result ? blogTypeSchema.parse(result) : null;
  return blog;
};

const countBlogsByQuery = async (filterQuery: FilterQuery<BlogType>) => {
  await connectToDatabase();
  const result = await Blog.countDocuments(filterQuery);
  return result;
};

const searchBlogsByQuery = async ({
  filterQuery,
  sortOptions,
  skip,
  limit,
}: {
  filterQuery: FilterQuery<BlogType>;
  sortOptions?: QueryOptions<BlogType>;
  skip?: number;
  limit?: number;
}) => {
  await connectToDatabase();
  let query = Blog.find(filterQuery).sort(sortOptions);
  if (skip) {
    query = query.skip(skip);
  }
  if (limit) {
    query = query.limit(limit);
  }

  const result = await query.lean();

  const items: BlogType[] = result.map((item) => blogTypeSchema.parse(item));

  return items;
};

const searchBlogsIncludeTotalItemsByQuery = async ({
  query,
  sortOptions = {},
  skip = 0,
  limit = MAX_SEARCH_RESULT,
}: {
  query: FilterQuery<BlogType>;
  sortOptions?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}) => {
  await connectToDatabase();
  const result = await Blog.aggregate([
    { $match: query },
    {
      $facet: {
        total: [{ $count: "count" }],
        items: [{ $sort: sortOptions }, { $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const items: BlogType[] = result[0].items.map(blogTypeSchema.parse);

  const total: number = result[0].total[0]?.count || 0;

  return {
    items,
    total,
  };
};

const searchBlogAndSimpleReturnByQuery = async ({
  query,
  limit = MAX_SEARCH_RESULT,
}: {
  query: FilterQuery<BlogType>;
  limit?: number;
}) => {
  await connectToDatabase();
  const result = await Blog.aggregate([
    { $match: { ...query } },
    {
      $facet: {
        blogs: [
          {
            $project: {
              _id: 1,
              title: 1,
              slug: 1,
              image: "$wallImage",
              updatedAt: 1,
            },
          },
          { $limit: limit },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);
  const blogs: SearchBlogResultType[] = result[0].blogs.map(
    searchBlogResultSchema.parse,
  );
  const total: number = result[0].total[0]?.count || 0;

  return { result: blogs, total };
};

const createBlog = async (input: BlogDbInputType) => {
  connectToDatabase();
  const result = await Blog.create(input);
  const blog = blogTypeSchema.parse(result);
  return blog;
};

const updateBlog = async (input: BlogDbInputType & { id: string }) => {
  await connectToDatabase();
  const result = await Blog.findOneAndUpdate({ _id: input.id }, input, {
    new: true,
  });
  const blog = blogTypeSchema.parse(result);
  return blog;
};

const deleteBlog = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const count = await Blog.countDocuments({ _id: { $in: idsArray } });

  if (count !== idsArray.length) {
    throw new NotFoundError({
      resource: RESOURCE_TYPES.BLOG,
      message: ERROR_MESSAGES.BLOG.NOT_FOUND,
    });
  }

  await Blog.deleteMany({ _id: { $in: idsArray } });

  return ids;
};

const blogsRepository = {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getRecentBlogs,
  getBlogsByTags,
  searchBlogsByQuery,
  searchBlogsIncludeTotalItemsByQuery,
  searchBlogAndSimpleReturnByQuery,
  countBlogsByQuery,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default blogsRepository;

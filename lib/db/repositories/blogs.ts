import { BlogDbInputType, BlogType } from "@/features/blogs/blog.types";
import { connectToDatabase } from "..";
import Blog from "../model/blog.model";
import { ERROR_MESSAGES, MAX_SEARCH_RESULT, PAGE_SIZE } from "@/constants";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { searchBlogResultSchema } from "@/features/filter/filter.validator";
import { blogTypeSchema } from "@/features/blogs/blog.validators";
import { SearchBlogResultType } from "@/features/filter/filter.types";
import { Id } from "@/types";
import { NotFoundError } from "@/lib/error";

const getAllBlogs = async () => {
  await connectToDatabase();
  const blogs = await Blog.find().sort({ updatedAt: -1 }).lean();
  const result = blogs.map((blog) => blogTypeSchema.parse(blog));

  return result;
};

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

const getRecentBlogs = async ({
  limit = PAGE_SIZE.BLOGS.SM,
  skip = 0,
  isPublished = true,
} = {}) => {
  await connectToDatabase();
  const query: FilterQuery<BlogType> = {};
  if (isPublished) {
    query.isPublished = true;
  }
  const blogs = await Blog.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const result = blogs.map((blog) => blogTypeSchema.parse(blog));

  return result;
};

const getBlogById = async (id: string) => {
  await connectToDatabase();
  const result = await Blog.findById(id).lean();

  const blog = result ? blogTypeSchema.parse(result) : null;
  return blog;
};

export const getBlogsByIds = async (ids: string[]) => {
  await connectToDatabase();
  const result = await Blog.find({ _id: { $in: ids } }).lean();
  const blogs = result.map((blog) => blogTypeSchema.parse(blog));
  return blogs;
};

const getBlogBySlug = async (slug: string) => {
  await connectToDatabase();
  const result = await Blog.findOne({ slug });
  const blog = result ? blogTypeSchema.parse(result) : null;
  return blog;
};

const countBlogsByQuery = async (filterQuery: FilterQuery<BlogType>) => {
  await new Promise((r) => setTimeout(r, 2000));
  await connectToDatabase();
  const result = await Blog.countDocuments(filterQuery);
  return result;
};

// const countBlogsByTags = async (tags: string[]) => {
//   await connectToDatabase();
//   const query = tags.length > 0 ? { tags: { $in: tags } } : {};
//   const result = await Blog.countDocuments(query);
//
//   return result;
// };

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
  queries,
  includeDraft,
  limit = MAX_SEARCH_RESULT,
}: {
  queries: FilterQuery<BlogType>[];
  includeDraft: boolean;
  limit?: number;
}) => {
  await connectToDatabase();

  if (!includeDraft) {
    queries.push({
      isPublished: true,
    });
  }
  const result = await Blog.aggregate([
    ...queries.map((query) => ({ $match: query })),
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

const updateBlog = async ({
  filterQuery,
  updateQuery,
}: {
  filterQuery: FilterQuery<BlogType>;
  updateQuery: UpdateQuery<BlogType>;
}) => {
  await connectToDatabase();
  const result = await Blog.findOneAndUpdate(filterQuery, updateQuery);
  if (!result) {
    throw new NotFoundError({
      resource: "blog",
      message: ERROR_MESSAGES.BLOG.NOT_FOUND,
    });
  }
};

// warning: use this if check ids exist before
const setPublishedStatus = async ({
  ids,
  isPublished,
}: {
  ids: Id | Id[];
  isPublished: boolean;
}) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];
  await Blog.updateMany(
    { _id: { $in: idsArray } },
    {
      $set: {
        isPublished,
      },
    },
  ).lean();

  return ids;
};

const deleteBlog = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  // const count = await Blog.countDocuments({ _id: { $in: idsArray } });

  // if (count !== idsArray.length) {
  //   throw new NotFoundError({
  //     resource: RESOURCE_TYPES.BLOG,
  //     message: ERROR_MESSAGES.BLOG.NOT_FOUND,
  //   });
  // }

  await Blog.deleteMany({ _id: { $in: idsArray } });

  return ids;
};

const blogsRepository = {
  getAllBlogs,
  getBlogById,
  getBlogsByIds,
  getBlogBySlug,
  getRecentBlogs,
  getBlogsByTags,
  searchBlogsByQuery,
  searchBlogsIncludeTotalItemsByQuery,
  searchBlogAndSimpleReturnByQuery,
  countBlogsByQuery,
  // countBlogsByTags,
  createBlog,
  updateBlog,
  setPublishedStatus,
  deleteBlog,
};

export default blogsRepository;

import { BlogDbInputType, BlogType } from "@/features/blogs/blog.types";
import { connectToDatabase } from "..";
import Blog from "../model/blog.model";
import { CACHE, ERROR_MESSAGES, MAX_SEARCH_RESULT } from "@/constants";
import { unstable_cache } from "next/cache";
import { NotFoundError, RESOURCE_TYPES } from "@/lib/error";
import { FilterQuery } from "mongoose";
import { searchBlogResultSchema } from "@/features/filter/filter.validator";
import { blogTypeSchema } from "@/features/blogs/blog.validators";
import { SearchBlogResultType } from "@/features/filter/filter.types";

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

const searchBlogByQuery = async ({
  query,
}: {
  query: FilterQuery<BlogType>;
}) => {
  await connectToDatabase();
  const blogs = await Blog.find(query).lean();
  const result = blogs.map((blog) => blogTypeSchema.parse(blog));
  return result;
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
  searchBlogByQuery,
  searchBlogAndSimpleReturnByQuery,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default blogsRepository;

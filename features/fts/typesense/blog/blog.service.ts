import {
  createCollection,
  deleteCollection,
  importDocuments,
  searchDocuments,
  truncateCollection,
} from "../typesense.utils";
import blogsRepository from "@/lib/db/repositories/blogs";
import { getLink } from "@/lib/utils";
import { typesenseBlogName, typesenseBlogSchema } from "./blog.schema";
import { defaultBlogSearchParrams } from "./blog.constants";

const collectionName = typesenseBlogName;

export const createBlogsCollection = async () => {
  await createCollection(collectionName, typesenseBlogSchema);
};

export const populateBlogsCollection = async () => {
  const blogs = await blogsRepository.getAllBlogs();
  const input = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    titleNoAccent: blog.titleNoAccent,
    slug: blog.slug,
    link: getLink.blog.view({ blogSlug: blog.slug }),
    image: blog.wallImage,
    updatedAt: blog.updatedAt,
  }));

  await truncateCollection(collectionName);
  await importDocuments(collectionName, input);
};

export const searchBlogs = async ({
  query,
  page,
  size,
}: {
  query?: string;
  page: number;
  size: number;
}) => {
  const result = await searchDocuments(collectionName, {
    q: query ?? "*",
    query_by: "title,titleNoAccent",
    infix: ["always", "always"],
    ...defaultBlogSearchParrams,
    page,
    per_page: size,
  });

  return {
    total: result.found,
    items: result.hits?.map((hit) => hit.document) ?? [],
  };
};

export const deleteBlogCollection = async () => {
  await deleteCollection(collectionName);
};

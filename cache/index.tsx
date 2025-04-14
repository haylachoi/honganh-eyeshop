import blogsRepository from "@/lib/db/repositories/blogs";
import { unstable_cache } from "next/cache";
import { CACHE_CONFIG } from "./cache.constant";

const next_cache = {
  blogs: {
    searchByTags: unstable_cache(
      blogsRepository.getBlogsByTags,
      CACHE_CONFIG.BLOGS.BY_TAG.KEY_PARTS,
      {
        tags: CACHE_CONFIG.BLOGS.BY_TAG.TAGS,
        revalidate: CACHE_CONFIG.BLOGS.BY_TAG.TIME,
      },
    ),
  },
};

export default next_cache;

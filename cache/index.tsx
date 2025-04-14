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
    searchByQuery: unstable_cache(
      blogsRepository.searchBlogsByQuery,
      CACHE_CONFIG.BLOGS.BY_QUERY.KEY_PARTS,
      {
        tags: CACHE_CONFIG.BLOGS.BY_QUERY.TAGS,
        revalidate: CACHE_CONFIG.BLOGS.BY_QUERY.TIME,
      },
    ),
    countByQuery: unstable_cache(
      blogsRepository.countBlogsByQuery,
      CACHE_CONFIG.BLOGS.COUNT_ITEMS.KEY_PARTS,
      {
        tags: CACHE_CONFIG.BLOGS.COUNT_ITEMS.TAGS,
        revalidate: CACHE_CONFIG.BLOGS.COUNT_ITEMS.TIME,
      },
    ),
    recent: unstable_cache(
      blogsRepository.getRecentBlogs,
      CACHE_CONFIG.BLOGS.RECENT.KEY_PARTS,
      {
        revalidate: CACHE_CONFIG.BLOGS.RECENT.TIME,
      },
    ),
  },
};

export default next_cache;

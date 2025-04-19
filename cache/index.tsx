import blogsRepository from "@/lib/db/repositories/blogs";
import { unstable_cache } from "next/cache";
import { CACHE_CONFIG } from "./cache.constant";
import reviewRepository from "@/lib/db/repositories/reviews";
import productRepository from "@/lib/db/repositories/products";
import tagsRepository from "@/lib/db/repositories/tags";
import ordersRepository from "@/lib/db/repositories/orders";
import { cartRepository } from "@/lib/db/repositories/cart";
import categoriesRepository from "@/lib/db/repositories/categories";
import couponsRepository from "@/lib/db/repositories/coupons";
import filtersRepository from "@/lib/db/repositories/filters";
import userRepository from "@/lib/db/repositories/user";

const next_cache = {
  users: {
    getAll: unstable_cache(
      userRepository.getAllUsers,
      CACHE_CONFIG.USERS.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.USERS.ALL.TAGS,
        revalidate: CACHE_CONFIG.USERS.ALL.TIME,
      },
    ),
  },
  categories: {
    getAll: unstable_cache(
      categoriesRepository.getAllCategories,
      CACHE_CONFIG.CATEGORIES.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.CATEGORIES.ALL.TAGS,
        revalidate: CACHE_CONFIG.CATEGORIES.ALL.TIME,
      },
    ),
  },
  products: {
    getAll: unstable_cache(
      productRepository.getAllProducts,
      CACHE_CONFIG.PRODUCTS.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.PRODUCTS.ALL.TAGS,
        revalidate: CACHE_CONFIG.PRODUCTS.ALL.TIME,
      },
    ),
    getByTags: unstable_cache(
      productRepository.getProductByTags,
      CACHE_CONFIG.PRODUCTS.PRODUCTS_TAGS.PAGEGINATION.KEY_PARTS,
      {
        tags: CACHE_CONFIG.PRODUCTS.PRODUCTS_TAGS.PAGEGINATION.TAGS,
        revalidate: CACHE_CONFIG.PRODUCTS.PRODUCTS_TAGS.PAGEGINATION.TIME,
      },
    ),
  },
  tags: {
    getAll: unstable_cache(
      tagsRepository.getAllTags,
      CACHE_CONFIG.TAGS.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.TAGS.ALL.TAGS,
        revalidate: CACHE_CONFIG.TAGS.ALL.TIME,
      },
    ),
  },
  coupons: {
    getAll: unstable_cache(
      couponsRepository.getAllCoupons,
      CACHE_CONFIG.COUPONS.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.COUPONS.ALL.TAGS,
        revalidate: CACHE_CONFIG.COUPONS.ALL.TIME,
      },
    ),
  },
  blogs: {
    all: unstable_cache(
      blogsRepository.getAllBlogs,
      CACHE_CONFIG.BLOGS.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.BLOGS.ALL.TAGS,
        revalidate: CACHE_CONFIG.BLOGS.ALL.TIME,
      },
    ),
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
        tags: CACHE_CONFIG.BLOGS.RECENT.TAGS,
        revalidate: CACHE_CONFIG.BLOGS.RECENT.TIME,
      },
    ),
  },
  orders: {
    all: unstable_cache(
      ordersRepository.getAllOrders,
      CACHE_CONFIG.ORDER.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.ORDER.ALL.TAGS,
        revalidate: CACHE_CONFIG.ORDER.ALL.TIME,
      },
    ),
  },
  cart: {
    getByUserId: unstable_cache(
      cartRepository.getCartByUserId,
      CACHE_CONFIG.CART.USER.KEY_PARTS,
      {
        tags: CACHE_CONFIG.CART.USER.TAGS,
        revalidate: CACHE_CONFIG.CART.USER.TIME,
      },
    ),
  },
  reviews: {
    admin: {
      getAllWithFullInfo: unstable_cache(
        reviewRepository.getAllReviewsWithFullInfo,
        CACHE_CONFIG.REVIEWS.ALL.KEY_PARTS,
        {
          tags: CACHE_CONFIG.REVIEWS.ALL.TAGS,
          revalidate: CACHE_CONFIG.REVIEWS.ALL.TIME,
        },
      ),
    },
  },

  filters: {
    getAll: unstable_cache(
      filtersRepository.getAllFilters,
      CACHE_CONFIG.FILTER.ALL.KEY_PARTS,
      {
        tags: CACHE_CONFIG.FILTER.ALL.TAGS,
        revalidate: CACHE_CONFIG.FILTER.ALL.TIME,
      },
    ),
    getByCategoryId: unstable_cache(
      filtersRepository.getFilterByCategoryId,
      CACHE_CONFIG.FILTER.ID.KEY_PARTS,
      {
        tags: CACHE_CONFIG.FILTER.ID.TAGS,
        revalidate: CACHE_CONFIG.FILTER.ID.TIME,
      },
    ),
    getByCategorySlug: unstable_cache(
      filtersRepository.getFilterByCategorySlug,
      CACHE_CONFIG.FILTER.SLUG.KEY_PARTS,
      {
        tags: CACHE_CONFIG.FILTER.SLUG.TAGS,
        revalidate: CACHE_CONFIG.FILTER.SLUG.TIME,
      },
    ),
  },
};

export default next_cache;

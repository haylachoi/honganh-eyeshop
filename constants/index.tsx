import config from "@/app-config.json";

// 1. App Info
export const APP_NAME = config.appName;
export const SOLOGAN = config.slogan;

// 2. Session / Auth
export const SESSION_NAME = config.sessionName;
export const UNVERIFIED_ACCOUNT_CLEANUP_DAYS =
  config.unVerifiedAccountCleanupDays;

// 3. Search
export const MIN_CHARACTER_LENGTH_FOR_SEARCH =
  config.minCharacterLengthForSearch;
export const MAX_SEARCH_RESULT = config.maxSearchResult;

// 4. Images
export const MAX_IMAGE_SIZE = config.maxImageSize;
export const BASE_IMAGES_FOLDER = "images";
export const IMAGES_FOlDERS = ["users", "products", "blogs", "orders"] as const;

// 5. Pricing / Payment / Shipping
export const PRICE_CURRENCY = config.priceCurrency;
export const SHIPPING_FEE = config.shippingFee;
export const VNPAY_ENABLE = config.paymentMethod.vnpay;

// 6. URLs / Secrets
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:3000";

export const JOB_SECRET = process.env.JOB_SECRET;

// 7. Views Count
export const VIEWS_COUNT_CONFIG = config.viewCount;

// 8. Pagination
export const PAGE_SIZE = {
  DEFAULT: 10,
  TRENDING: { SM: 8, MD: 12, LG: 20, XL: 30 },
  NEW_ARRIVAL: { SM: 8, MD: 12, LG: 20, XL: 30 },
  PRODUCTS: { SM: 8, MD: 12, LG: 20, XL: 30 },
  BLOGS: { SM: 8, MD: 12, LG: 20, XL: 30 },
  REVIEWS: { SM: 8, MD: 12, LG: 20, XL: 30 },
  ORDER: {
    ALL: { SM: 8, MD: 10, LG: 20, XL: 30 },
    HISTORY: { SM: 8, MD: 12, LG: 20, XL: 30 },
  },
};

// 9. Sorting
export const KEYWORDS = {
  pagination: {
    page: "page",
    size: "page_size",
  },
  sorting: {
    sort_by: "sortBy",
    order_by: "orderBy",
    name: "name",
    price: "minPrice",
    asc: "asc",
    desc: "desc",
  },
  filter: {
    category: "category",
    price: "price",
    search: "search",
    tag: "tag",
    sale: "sale",
  },
};

export const FILTER_KEYWORDS = KEYWORDS.filter;
export const SORTING_KEYWORDS = KEYWORDS.sorting;
export const PAGINATION_KEYWORDS = KEYWORDS.pagination;

export const DEFAULT_SORTING = {
  products: {
    [SORTING_KEYWORDS.sort_by]: "name",
    [SORTING_KEYWORDS.order_by]: SORTING_KEYWORDS.desc,
  },
};

export const SEARCH_ENGINE = config.searchEngine;

export const GOOGLE_AUTH = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
};

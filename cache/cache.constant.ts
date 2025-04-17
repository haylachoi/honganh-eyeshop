export const CACHE_CONFIG = {
  REVALIDATE_TIME: {
    XS: 3600,
    SM: 3600 * 24,
  },
  CATEGORIES: {
    ALL: {
      KEY_PARTS: ["categories"],
      TAGS: "categories",
    },
  },
  TAGS: {
    ALL: {
      KEY_PARTS: ["tags"],
      TAGS: "tags",
    },
  },
  PRODUCTS: {
    ALL: {
      KEY_PARTS: ["products"],
      TAGS: "products",
    },
  },
  BLOGS: {
    ALL: {
      KEY_PARTS: ["blogs"],
      TAGS: "blogs",
    },
    RECENT: {
      KEY_PARTS: ["recent_blogs", "skip", "limit"],
      TAGS: ["blogs"],
      TIME: 3600,
    },
    BY_TAG: {
      KEY_PARTS: ["blogs", "tag", "skip", "limit"],
      TAGS: ["blogs"],
      TIME: 3600,
    },
    BY_QUERY: {
      KEY_PARTS: ["blogs", "filter", "sorting", "skip", "limit"],
      TAGS: ["blogs"],
      TIME: 3600,
    },
    COUNT_ITEMS: {
      KEY_PARTS: ["blogs", "filter"],
      TAGS: ["blogs"],
      TIME: 3600,
    },
  },
  COUPONS: {
    ALL: {
      KEY_PARTS: ["coupons"],
      TAGS: "coupons",
    },
  },
  PRODUCTS_TAGS: {
    ALL: {
      KEY_PARTS: ["trending"],
      TAGS: "tags",
      TIME: 3600,
    },
    PAGEGINATION: {
      KEY_PARTS: ["trending", "skip", "limit"],
      TAGS: "tags",
      TIME: 3600,
    },
  },
  CART: {
    ALL: {
      KEY_PARTS: ["cart"],
      TAGS: "cart",
    },
    USER: {
      KEY_PARTS: ["cart", "user"],
      TAGS: "user_cart",
    },
  },
  ORDER: {
    ALL: {
      KEY_PARTS: ["order"],
      TAGS: "order",
    },
  },
  FILTER: {
    ALL: {
      KEY_PARTS: ["filter"],
      TAGS: "filter",
    },
    ID: {
      KEY_PARTS: ["filter", "id"],
      TAGS: "filter",
    },
    SLUG: {
      KEY_PARTS: ["filter", "slug"],
      TAGS: "filter",
    },
  },
  REVIEWS: {
    ALL: {
      KEY_PARTS: ["review"],
      TAGS: ["review"],
      TIME: 3600,
    },
  },
};

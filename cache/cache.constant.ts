export const CACHE_CONFIG = {
  REVALIDATE_TIME: {
    XS: 3600,
    SM: 3600 * 24,
  },
  USERS: {
    ALL: {
      KEY_PARTS: ["users"],
      TAGS: ["users"],
      TIME: 3600,
    },
    BY_ID: {
      KEY_PARTS: ["users", "id"],
      TAGS: ["users"],
      TIME: 3600,
    },
  },
  CATEGORIES: {
    ALL: {
      KEY_PARTS: ["categories"],
      TAGS: ["categories"],
      TIME: 3600,
    },
  },
  TAGS: {
    ALL: {
      KEY_PARTS: ["tags"],
      TAGS: ["tags"],
      TIME: 3600,
    },
  },
  PRODUCTS: {
    ALL: {
      KEY_PARTS: ["products"],
      TAGS: ["products"],
      TIME: 3600,
    },
    PRODUCTS_TAGS: {
      PAGEGINATION: {
        KEY_PARTS: ["products", "tags", "skip", "limit", "private"],
        TAGS: ["products"],
        TIME: 3600,
      },
    },
    PRODUCTS_EACH_CATEGORY: {
      KEY_PARTS: ["products_EACH_CATEGORY"],
      TAGS: ["products"],
      TIME: 3600,
    },
  },
  BLOGS: {
    ALL: {
      KEY_PARTS: ["blogs_all"],
      TAGS: ["blogs"],
      TIME: 3600,
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
      TAGS: ["coupons"],
      TIME: 3600,
    },
  },
  CART: {
    // ALL: {
    //   KEY_PARTS: ["cart"],
    //   TAGS: "cart",
    // },
    USER: {
      KEY_PARTS: ["cart", "user"],
      TAGS: ["user_cart"],
      TIME: 3600,
    },
  },
  ORDER: {
    ALL: {
      KEY_PARTS: ["order"],
      TAGS: ["order"],
      TIME: 3600,
    },
    HISTORY: {
      ITEMS: {
        KEY_PARTS: ["order_history", "userId", "skip", "limit"],
        TAGS: ["order"],
        TIME: 3600,
      },
      COUNT: {
        KEY_PARTS: ["order_history", "userId"],
        TAGS: ["order"],
        TIME: 3600,
      },
    },
  },
  FILTER: {
    ALL: {
      KEY_PARTS: ["filter"],
      TAGS: ["filter"],
      TIME: 3600,
    },
    ID: {
      KEY_PARTS: ["filter", "id"],
      TAGS: ["filter"],
      TIME: 3600,
    },
    SLUG: {
      KEY_PARTS: ["filter", "slug"],
      TAGS: ["filter"],
      TIME: 3600,
    },
  },
  REVIEWS: {
    ALL: {
      KEY_PARTS: ["review"],
      TAGS: ["review"],
      TIME: 3600,
    },
  },
  DASHBOARD: {
    DAILY: {
      KEY_PARTS: ["dashboard", "daily"],
      TAGS: ["dashboard"],
      TIME: 120,
    },
    MONTHLY_BY_DAILY: {
      KEY_PARTS: ["dashboard_by_daily", "monthly"],
      TAGS: ["dashboard"],
      TIME: 120,
    },
    LAST_7_DAYS: {
      KEY_PARTS: ["dashboard", "last_7_days"],
      TAGS: ["dashboard"],
      TIME: 120,
    },
  },
};

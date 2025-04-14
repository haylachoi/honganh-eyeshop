import { createUppercaseMap } from "@/lib/utils";

export const APP_NAME = "honganh-eyeshop";
export const BASE_URL = "http://localhost:3000";

export const SESSION_NAME = "session";
export const MIN_CHARACTER_LENGTH_FOR_SEARCH = 3;
export const MAX_SEARCH_RESULT = 10;

export const PRODUCTS_PER_PAGE = 12;

export const PAGE_SIZE = {
  TRENDING: {
    SM: 8,
    MD: 12,
    LG: 20,
    XL: 30,
  },
  NEW_ARRIVAL: {
    SM: 8,
    MD: 12,
    LG: 20,
    XL: 30,
  },
  PRODUCTS: {
    SM: 8,
    MD: 12,
    LG: 20,
    XL: 30,
  },
  BLOGS: {
    SM: 8,
    MD: 12,
    LG: 20,
    XL: 30,
  },
};

export const ENDPOINTS = {
  HOME: "/",
  PROFILE: "/profile",
  LOGIN: "/login",
  SIGN_UP: "/signup",
  CART: "/cart",
  CHECKOUT: "/checkout",
  CATEGORIES: "/c",
  PRODUCTS: "/c",
  BLOGS: "/blogs",
  ORDER: "/order",
  ON_SALE: "/on-sale",
  MOST_POPULAR: "/most-popular",
  TRENDING: "/trending",
  NEW_ARRIVAL: "/new-arrival",
  ORDER_ONLINE: "/order-online",
  CHEAP_GLASSES: "/cheap-glasses",
  POLICY: "/policy",
  SEARCH: "/search",
};

export const ADMIN_ENDPOINTS = {
  HOME: "/admin",
  OVERVIEW: "/admin",
  CATEGORIES: "/admin/categories",
  PRODUCTS: "/admin/products",
  TAGS: "/admin/tags",
  BLOGS: "/admin/blogs",
  COUPONS: "/admin/coupons",
  ORDERS: "/admin/orders",
  OTHERS: "/admin/others",
};

export const SORT_BY_VALUES = ["asc", "desc"] as const;
export const SORT_BY_OPTIONS = createUppercaseMap(SORT_BY_VALUES);

export const SORTING_OPTIONS = {
  SORT_BY: "sort_by",
  NAME: "name",
  PRICE: "minPrice",
  // MIN_PRICE: "minPrice",
  // MAX_PRICE: "maxPrice",
  ORDER_BY: "order_by",
  ASC: "asc",
  DESC: "desc",
};

export const FILTER_NAME = {
  CATEGORY: "category",
  PRICE: "price",
  SEARCH: "search",
};

export const ADDRESS = "123 Nguyễn Văn Nhật, Đồng Nai, Hà Nội";
export const PHONE = "123-456-7890";
export const PHONE_LINK = `tel:${PHONE}`;
export const EMAIL = "nv@nv.com.vn";
export const EMAIL_LINK = `mailto:${EMAIL}`;

export const REVIEW_ELIGIBILITY_PERIOD = 7;

export const CACHE = {
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
};

export const ERROR_MESSAGES = {
  NOT_FOUND: {
    ID: {
      SINGLE: "ID không tồn tại",
      MULTIPLE: "Một hoặc nhiều ID không tồn tại",
    },
    INFO: {
      SINGLE: "Thông tin không tồn tại",
      MULTIPLE: "Một hoặc nhiều thông tin không tồn tại",
    },
    SLUG: {
      SINGLE: "Slug không tồn tại",
      MULTIPLE: "Một hoặc nhiều slug không tồn tại",
    },
    // USER: {
    //   SINGLE: "Người dùng không tồn tại",
    //   MULTIPLE: "Một hoặc nhiều người dùng không tồn tại",
    // },
    // PRODUCT: {
    //   SINGLE: "Sản phẩm không tồn tại",
    //   MULTIPLE: "Một hoặc nhiều sản phẩm không tồn tại",
    //   NOT_ENOUGH_STOCK: "Hàng trong kho không đủ",
    // },
    VARIANT: {
      SINGLE: "Variant không tồn tại",
      MULTIPLE: "Một hoặc nhiều variant không tồn tại",
    },
  },
  AUTH: {
    UNAUTHENTICATED: "Bạn chưa đăng nhập",
    UNAUTHORIZED: "Bạn không có quyền truy cập",
  },
  USER: {
    NOT_FOUND: "Người dùng không tồn tại",
  },
  BLOG: {
    NOT_FOUND: "Blog không tồn tại",
  },
  CATEGORY: {
    NOT_FOUND: "Danh mục không tồn tại",
  },
  PRODUCT: {
    NOT_FOUND: "Sản phẩm không tồn tại",
    NOT_ENOUGH_STOCK: "Hàng trong kho không đủ",
  },
  TAG: {
    NOT_FOUND: "Thẻ không tồn tại",
  },
  COUPON: {
    NOT_FOUND: "Mã giảm giá không tồn tại",
    INVALID_COUPON: "Mã giảm giá không hợp lệ",
  },
  CART: {
    NOT_FOUND: "Giỏ hàng trống",
  },
  CHECKOUT: {
    NOT_FOUND: "Thanh toán không tồn tại",
  },
  ORDER: {
    CREATE: {
      SUCCESS: "Đã tạo đơn hàng thành công",
      ERROR: {
        GENERAL: "Tạo đơn hàng thất bại",
        UNAVAILABLE: "Sản phẩm không hợp lệ hoặc không đủ hàng",
      },
    },
    NOT_FOUND: "Đơn hàng không tồn tại",
  },
};

export const TOAST_MESSAGES = {
  UPDATE: {
    SUCCESS: "Đã cập nhật thông tin thành công",
    ERROR: "Cập nhật thông tin thất bại",
  },
  DELETE: {
    SUCCESS: "Đã xóa thông tin thành công",
    ERROR: "Xóa thông tin thất bại",
  },
  CREATE: {
    SUCCESS: "Đã tạo thông tin thành công",
    ERROR: "Tạo thông tin thất bại",
  },
  PRODUCT: {
    NOT_ENOUGH_STOCK: "Hàng trong kho không đủ",
  },
  AUTH: {
    SIGN_UP: {
      SUCCESS: "Đã đăng ký thành công",
      ERROR: "Đăng ký thất bại",
    },
    LOGIN: {
      SUCCESS: "Đã đăng nhập thành công",
      NOT_MATCH: "Email hoặc Mật khẩu không khớp",
      ERROR: "Đăng nhập thất bại",
    },
  },
  CHECKOUT: {
    CREATE: {
      SUCCESS: "Thanh toán thành công",
      ERROR: "Thanh toán thất bại",
    },
  },
  CART: {
    ADD: {
      SUCCESS: "Đã thêm vào giỏ thành công",
      ERROR: "Thêm vào giỏ thất bại",
    },
  },
  REVIEW: {
    CREATE: {
      SUCCESS: "Đã gửi đánh giá thành công",
      ERROR: "Gửi đánh giá thất bại",
    },
  },
  ORDER: {
    CREATE: {
      SUCCESS: "Đã tạo đơn hàng thành công",
      ERROR: {
        GENERAL: "Tạo đơn hàng thất bại",
        UNAVAILABLE: "Sản phẩm không hợp lệ hoặc không đủ hàng",
      },
    },
  },
};

export const SHIPPING_FEE = Number(process.env.SHIPPING_FEE ?? 0);

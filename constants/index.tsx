import { createUppercaseMap } from "../lib/utils";

// todo: validate env
export const APP_NAME = "honganh-eyeshop";
export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const SESSION_NAME = "session";
export const MIN_CHARACTER_LENGTH_FOR_SEARCH = 3;
export const MAX_SEARCH_RESULT = 10;

export const PRODUCTS_PER_PAGE = 12;

export const IMAGES_FORDERS = ["users", "products", "blogs"] as const;

export const MAX_IMAGE_SIZE = 1024 * 100; // 100 KB
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
  ORDER: {
    HISTORY: {
      SM: 8,
      MD: 12,
      LG: 20,
      XL: 30,
    },
  },
};

export const ENDPOINTS = {
  HOME: "/",
  AUTH: {
    VERIFY_TOKEN: "/verify",
    ACTIVE_ACCOUNT: "/active-account",
    RESET_PASSWORD: "/reset-password",
    FORGOT_PASSWORD: "/forgot-password",
    LOGIN: "/login",
    SIGN_UP: "/signup",
  },
  PROFILE: {
    USER_INFO: "/user-info",
    USER_PASSWORD: "/user-password",
    USER_ADDRESS: "/user-address",
  },
  CART: "/cart",
  CHECKOUT: "/checkout",
  CATEGORIES: "/c",
  PRODUCTS: "/c",
  BLOGS: {
    home: "/blogs",
    view: "/b",
  },
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
  REVIEWS: "/admin/reviews",
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
  TAG: "tag",
};

export const ADDRESS = "123 Nguyễn Văn Nhật, Đồng Nai, Hà Nội";
export const PHONE = "123-456-7890";
export const PHONE_LINK = `tel:${PHONE}`;
export const EMAIL = "nv@nv.com.vn";
export const EMAIL_LINK = `mailto:${EMAIL}`;

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
    PASSWORD_MISMATCH: "Mật khẩu không khớp",
  },
  VERYFY_TOKEN: {
    NOT_FOUND: "Token không hợp lệ hoặc đã hết hạn",
    NOT_FOUND_OR_EXPIRED: "Token không hợp lệ hoặc đã hết hạn",
    EXPIRED: "Token đã hết hạn",
  },
  USER: {
    NOT_FOUND: "Người dùng không tồn tại",
    NOT_VERIFIED: "Tài khoản chưa được xác minh",
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
    NOT_AVAILABLE: "Sản phẩm hiện không kinh doanh",
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
    ITEM_NOT_AVAILABLE: "Sản phẩm không hợp lệ hoặc không đủ hàng",
  },
  REVIEW: {
    NOT_FOUND: "Bình luận không tồn tại",
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
    HIDE: {
      SUCCESS: "Đã ẩn đánh giá thành công",
    },
    RESTORE: {
      SUCCESS: "Đã khôi phục đánh giá thành công",
    },
    DELETE: {
      SUCCESS: "Đã xóa đánh giá thành công",
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

export const PAGE_NUMBER_REGEX = /page-(\d+)/;

import { createUppercaseMap } from "../lib/utils";

// todo: validate env
export const APP_NAME = "Kính mắt Hồng Anh";
export const SOLOGAN = "Nét đẹp từ ánh nhìn đầu tiên";
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

export const SESSION_NAME = "session";
export const MIN_CHARACTER_LENGTH_FOR_SEARCH = 3;
export const MAX_SEARCH_RESULT = 10;

export const PRODUCTS_PER_PAGE = 12;

export const BASE_IMAGES_FOLDER = "images";
export const IMAGES_FOlDERS = ["users", "products", "blogs", "orders"] as const;

export const MAX_IMAGE_SIZE = 1024 * 100; // 100 KB

export const PRICE_CURRENCY = "VND";

export const JOB_SECRET = process.env.JOB_SECRET;

export const UNVERIFIED_ACCOUNT_CLEANUP_DAYS = 7;

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
    ALL: {
      SM: 8,
      MD: 10,
      LG: 20,
      XL: 30,
    },
    HISTORY: {
      SM: 8,
      MD: 12,
      LG: 20,
      XL: 30,
    },
  },
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

export const VIEWS_COUNT_CONFIG = {
  DELAY_THRESHOLD: 5000,
  MAX_VIEW_ACCUMULATION: 10,
  DB_FLUSH_THRESHOLD: 60 * 1000 * 2,
};

export const ADDRESS = "123 Nguyễn Văn Nhật, Đồng Nai, Hà Nội";
export const PHONE = "123-456-7890";
export const PHONE_LINK = `tel:${PHONE}`;
export const EMAIL = "nv@nv.com.vn";
export const EMAIL_LINK = `mailto:${EMAIL}`;

export const SHIPPING_FEE = Number(process.env.SHIPPING_FEE ?? 0);

export const APP_NAME = "honganh-eyeshop";
export const BASE_URL = "http://localhost:3000";

export const ENDPOINTS = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/signup",
  CATEGORIES: "/c",
  PRODUCTS: "/c",
  BLOGS: "/blogs",
  ON_SALE: "/on-sale",
  MOST_POPULAR: "/most-popular",
  TRENDING: "/trending",
  NEW_ARRIVAL: "/new-arrival",
  ORDER_ONLINE: "/order-online",
  CHEAP_GLASSES: "/cheap-glasses",
  POLICY: "/policy",
};

export const ADMIN_ENDPOINTS = {
  HOME: "/admin",
  OVERVIEW: "/admin",
  CATEGORIES: "/admin/categories",
  PRODUCTS: "/admin/products",
  TAGS: "/admin/tags",
  BLOGS: "/admin/blogs",
};

export const ADDRESS = "123 Nguyễn Văn Nhật, Đồng Nai, Hà Nội";
export const PHONE = "123-456-7890";
export const PHONE_LINK = `tel:${PHONE}`;
export const EMAIL = "nv@nv.com.vn";
export const EMAIL_LINK = `mailto:${EMAIL}`;

export const CACHE = {
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
};

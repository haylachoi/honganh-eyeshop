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
    USER_PERMISSION: "/user-permission",
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
  SUPPORT: {
    HOME: "/support",
    ABOUT_US: "/support/about-us",
    CONTACT: "/support/contact",
    STORES: "/support/stores",
    RECRUITMENT: "/support/recruitment",
    FAQ: "/support/faq",
  },
};

export const ADMIN_ENDPOINTS = {
  HOME: "/admin",
  OVERVIEW: "/admin",
  CATEGORIES: "/admin/categories",
  PRODUCTS: "/admin/products",
  TAGS: "/admin/tags",
  BLOGS: "/admin/blogs",
  COUPONS: "/admin/coupons",
  ORDERS: {
    LAST_30_DAYS: "/admin/orders/last30days",
    ALL: "/admin/orders/all",
  },
  REVIEWS: "/admin/reviews",
  ACCOUNTS: "/admin/accounts",
  OTHERS: "/admin/others",
  SETTINGS: "/admin/settings",
  SUPPORT: {
    SEGMENT: "/admin/support",
  },
};

export const API_ENDPOINTS = {
  VIEW_COUNT: "/api/viewCount",
};

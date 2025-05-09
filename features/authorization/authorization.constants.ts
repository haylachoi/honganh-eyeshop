export const RESOURCE_TYPES = {
  USER: "user",
  BLOG: "blog",
  PRODUCT: "product",
  TAG: "tag",
  CATEGORY: "category",
  SERVER: "server",
  UNKNOWN: "unknown",
  CART: "cart",
  CHECKOUT: "checkout",
  COUPON: "coupon",
  ORDER: "order",
  REVIEW: "review",
  VERIFY_TOKEN: "verifyToken",
  DASHBOARD: "dashboard",
  ALL: "all",
} as const;

export const ACTION = ["create", "modify", "delete", "view", "all"] as const;
export const SCOPE = ["all", "own", "public"] as const;
export const ADMIN_ROLES = ["admin", "seller"] as const;
export const ROLES = ["customer", ...ADMIN_ROLES, "guest"] as const;

export type Role = (typeof ROLES)[number];
export type Resource = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];
export type Action = (typeof ACTION)[number];
export type Scope = (typeof SCOPE)[number];

export const PERMISSIONS: {
  [key in Role]?: {
    [resource in Resource]?: {
      [action in Action]?: Scope[];
    };
  };
} = {
  guest: {
    product: {
      view: ["public"],
    },
    review: {
      view: ["public"],
    },
  },
  customer: {
    review: {
      create: ["all"],
      view: ["public"],
    },
    user: {
      modify: ["own"],
    },
  },
  seller: {
    order: {
      view: ["all"],
      modify: ["all"],
    },
    coupon: {
      view: ["all"],
    },
    product: {
      view: ["all"],
    },
    category: {
      view: ["all"],
    },
    blog: {
      create: ["all"],
      view: ["all"],
      modify: ["own"],
      delete: ["own"],
    },
    tag: {
      view: ["all"],
    },
    review: {
      view: ["all"],
    },
    dashboard: {
      view: ["all"],
    },
  },
};

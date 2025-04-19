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
  ALL: "all",
} as const;

export const ACTION = ["create", "modify", "delete", "view", "all"] as const;
export const SCOPE = ["all", "own", "public"] as const;
export const ROLES = ["customer", "seller", "admin", "guest"] as const;

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
      view: ["all"],
      modify: ["all"],
    },
    tag: {
      view: ["all"],
    },
    review: {
      view: ["all"],
    },
  },
  // guess: {
  //   product: {
  //     view: "public",
  //   },
  // },
};

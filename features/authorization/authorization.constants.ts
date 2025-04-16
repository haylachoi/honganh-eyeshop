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

export const ACTIONS = {
  MODIFY: "modify",
  DELETE: "delete",
  VIEW: "view",
  ALL: "all",
} as const;

export const SCOPES = {
  ALL: "all",
  OWN: "own",
  PUBLIC: "public",
} as const;

export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  GUEST: "guest",
};

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Resource = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export const PERMISSIONS: {
  [key in Role]?: {
    [resource in Resource]?: {
      [action in Action]?: Scope;
    };
  };
} = {
  customer: {
    product: {
      view: "public",
    },
  },
  guess: {
    product: {
      view: "public",
    },
  },
  admin: {
    all: {
      all: "all",
    },
  },
};

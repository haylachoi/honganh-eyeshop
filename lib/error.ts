import { ERROR_MESSAGES } from "@/constants";

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
} as const;

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

export const ERROR_TYPES = {
  DATABASE: "DatabaseError",
  AUTHENTICATION: "AuthenticationError",
  AUTHORIZATION: "AuthorizationError",
  DUPLICATE: "DuplicateError",
  NOT_FOUND: "NotFoundError",
  VALIDATION: "ValidationError",
  SERVER: "ServerError",
  UNKNOWN: "UnknownError",
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

export class AppError extends Error {
  type: ErrorType;
  resource?: ResourceType;

  constructor({
    type,
    message,
    resource,
  }: {
    type: ErrorType;
    message: string;
    resource?: ResourceType;
  }) {
    super(message);
    this.name = type;
    this.type = type;
    this.resource = resource;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class DatabaseError extends AppError {
  constructor({
    message = "A database error occurred",
    resource,
  }: {
    message?: string;
    resource?: ResourceType;
  }) {
    super({ type: "DatabaseError", message, resource });
  }
}

export class AuthenticationError extends AppError {
  constructor({
    message = ERROR_MESSAGES.AUTH.UNAUTHENTICATED,
    resource,
  }: {
    message?: string;
    resource?: ResourceType;
  }) {
    super({ type: "AuthenticationError", message, resource });
  }
}

export class AuthorizationError extends AppError {
  constructor({
    message = ERROR_MESSAGES.AUTH.UNAUTHORIZED,
    resource,
  }: {
    message?: string;
    resource?: ResourceType;
  }) {
    super({ type: "AuthorizationError", message, resource });
  }
}

export class NotFoundError extends AppError {
  constructor({
    message = "Resource not found",
    resource,
  }: {
    message?: string;
    resource?: ResourceType;
  }) {
    super({ type: "NotFoundError", message, resource });
  }
}

export class ValidationError extends AppError {
  constructor({
    resource,
    message = "Invalid input data",
  }: {
    resource: ResourceType;
    message?: string;
  }) {
    super({ type: "ValidationError", message, resource });
  }
}

export class ServerError extends AppError {
  constructor({
    resource = RESOURCE_TYPES.SERVER,
    message = "Server error",
  }: {
    resource?: ResourceType;
    message?: string;
  }) {
    super({
      type: ERROR_TYPES.SERVER,
      resource,
      message,
    });
  }
}

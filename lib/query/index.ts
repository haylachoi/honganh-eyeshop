import "server-only";

import { auth } from "@/features/auth/auth.auth";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError, AuthenticationError, AuthorizationError } from "../error";
import { QueryError } from "./query.type";
import { getScope } from "@/features/authorization/authorization.utils";
import SafeQuery from "../safe-query";
import {
  Resource,
  Scope,
} from "@/features/authorization/authorization.constants";
import { roleSchema } from "@/features/authorization/authorization.validator";

const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong";

export const safeQuery = new SafeQuery({
  errorHandler: (error): QueryError => {
    if (error instanceof ZodError) {
      console.error(error);
      return {
        message: DEFAULT_SERVER_ERROR_MESSAGE,
      };
    }

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      console.error(error);
      const duplicateField = Object.keys(error.keyValue)[0];
      return {
        message: `${duplicateField} already exists`,
      };
    }

    if (error instanceof AuthenticationError) {
      return {
        message: error.message,
        type: error.type,
      };
    }

    if (error instanceof AppError) {
      console.error(error);
      return {
        message: error.message,
        type: error.type,
      };
    }

    return {
      message: DEFAULT_SERVER_ERROR_MESSAGE,
    };
  },
});

export const authQueryClient = safeQuery.use(async ({ next, ctx }) => {
  // toto: check permission
  const session = await auth();

  if (!session) throw new AuthenticationError({});
  const userId = session?.id;
  const role = session?.role;
  return next({ ...ctx, userId, role });
});

export const customerQueryClient = safeQuery.use(async ({ ctx, next }) => {
  const session = await auth();

  const userId = session?.id;
  const role = session?.role;
  return next({ ...ctx, userId, role });
});

export const authCustomerQueryClient = safeQuery.use(async ({ ctx, next }) => {
  const session = await auth();
  if (!session) throw new AuthenticationError({});

  const userId = session.id;
  const role = roleSchema.parse(session.role);
  return next({ ...ctx, userId, role });
});

export const getAuthQueryClient = ({
  resource,
  scope,
}: {
  resource: Resource;
  scope?: Scope;
}) => {
  return authQueryClient.use(async ({ ctx, next }) => {
    const role = roleSchema.parse(ctx.role);
    const scopes = getScope({
      role,
      resource,
      action: "view",
    });

    if (!scopes) {
      throw new AuthorizationError({
        resource,
      });
    }

    if (scope && !scopes.includes(scope)) {
      throw new AuthorizationError({
        resource,
      });
    }

    return next({ ...ctx, resource, scopes });
  });
};

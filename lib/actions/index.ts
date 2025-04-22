import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z, ZodError } from "zod";
import mongoose from "mongoose";
import { auth } from "@/features/auth/auth.auth";
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ERROR_TYPES,
  ValidationError,
} from "../error";
import { ERROR_MESSAGES } from "@/constants";
import {
  Action,
  Resource,
  Scope,
} from "@/features/authorization/authorization.constants";
import { roleSchema } from "@/features/authorization/authorization.validator";
import { getScope } from "@/features/authorization/authorization.utils";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(e);
    if (e instanceof ZodError) {
      return {
        message: DEFAULT_SERVER_ERROR_MESSAGE,
      };
    }

    if (e instanceof mongoose.mongo.MongoServerError && e.code === 11000) {
      const duplicateField = Object.keys(e.keyValue)[0];
      return {
        message: `${duplicateField} already exists`,
        type: ERROR_TYPES.VALIDATION,
      };
    }

    if (e instanceof ValidationError) {
      return {
        message: e.message,
        type: e.type,
        detail: e.detail,
      };
    }

    if (e instanceof AppError) {
      return {
        message: e.message,
        type: e.type,
      };
    }

    return {
      message: DEFAULT_SERVER_ERROR_MESSAGE,
    };
  },
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
    }),
});

export const customerActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  const userId = session?.id;
  return next({ ctx: { userId } });
});

export const authCustomerActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session)
    throw new AuthenticationError({
      message: ERROR_MESSAGES.AUTH.UNAUTHENTICATED,
    });

  const userId = session.id;
  const role = session.role;
  return next({ ctx: { userId, role } });
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session)
    throw new AuthenticationError({
      message: ERROR_MESSAGES.AUTH.UNAUTHENTICATED,
    });

  const userId = session.id;
  const role = session.role;
  return next({ ctx: { userId, role } });
});

export const getAuthActionClient = ({
  resource,
  action,
  scope,
}: {
  resource: Resource;
  action: Action;
  scope?: Scope;
}) => {
  return authActionClient.use(async ({ ctx, next }) => {
    const role = roleSchema.parse(ctx.role);
    const scopes = getScope({
      role,
      resource,
      action,
    });

    const isAuthorized =
      scopes?.includes("all") || (scope ? scopes?.includes(scope) : true);

    if (!isAuthorized) {
      throw new AuthorizationError({ resource });
    }
    return next({
      ctx: {
        ...ctx,
        resource,
        action,
        scopes,
      },
    });
  });
};

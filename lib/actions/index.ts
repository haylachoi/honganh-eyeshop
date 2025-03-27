import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z, ZodError } from "zod";
import mongoose from "mongoose";
import { auth } from "@/features/auth/auth.query";
import { AppError, AuthenticationError, ERROR_TYPES } from "../error";
import { ERROR_MESSAGES } from "@/constants";

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
  if (!session)
    throw new AuthenticationError({
      message: ERROR_MESSAGES.AUTH.UNAUTHENTICATED,
    });

  const userId = session.id;
  return next({ ctx: { userId } });
});

export const authActionClient = actionClient.use(async ({ next }) => {
  // todo: check session
  return next();
});

import "server-only";

import SafeQuery from "../safe-query";
import { auth } from "@/features/auth/auth.query";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError, AuthenticationError } from "../error";

const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong";

export const safeQuery = new SafeQuery({
  errorHandler: (error): { message: string; type?: string } => {
    console.error(error);
    if (error instanceof ZodError) {
      return {
        message: DEFAULT_SERVER_ERROR_MESSAGE,
      };
    }

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return {
        message: `${duplicateField} already exists`,
      };
    }

    if (error instanceof AppError) {
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

export const customerQueryClient = safeQuery.use(async ({ ctx, next }) => {
  const session = await auth();
  if (!session) throw new AuthenticationError({});

  const userId = session.id;
  return next({ ...ctx, userId });
});

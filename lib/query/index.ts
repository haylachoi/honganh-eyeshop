import "server-only";

import SafeQuery from "../safe-query";
import { auth } from "@/features/auth/auth.query";
import { AppError } from "@/types";
import mongoose from "mongoose";
import { ZodError } from "zod";

const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong";

export const safeQuery = new SafeQuery({
  errorHandler: (error) => {
    if (error instanceof ZodError) {
      return DEFAULT_SERVER_ERROR_MESSAGE;
    }

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return `${duplicateField} already exists`;
    }

    if (error instanceof AppError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const customerQueryClient = safeQuery.use(async ({ ctx, next }) => {
  const session = await auth();
  if (!session) throw new AppError({ message: "Not logged in" });

  const userId = session.id;
  return next({ ...ctx, userId });
});

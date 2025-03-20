import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z, ZodError } from "zod";
import mongoose from "mongoose";
import { AppError } from "@/types";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(e);
    if (e instanceof ZodError) {
      return DEFAULT_SERVER_ERROR_MESSAGE;
    }

    if (e instanceof mongoose.mongo.MongoServerError && e.code === 11000) {
      const duplicateField = Object.keys(e.keyValue)[0];
      return `${duplicateField} already exists`;
    }

    if (e instanceof AppError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
    }),
});

export const authActionClient = actionClient.use(async ({ next }) => {
  // const session = await getSession();
  // console.log(session);
  return next();
});

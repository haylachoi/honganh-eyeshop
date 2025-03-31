import mongoose from "mongoose";
import { z } from "zod";

// export const MongoId = z
//   .string()
//   .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ID" });

export const MongoIdSchema = z.preprocess(
  (val) => (val instanceof mongoose.Types.ObjectId ? val.toHexString() : val),
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
);

// export const MongoIdSchema = z.custom<mongoose.Types.ObjectId>(
//   (val) => mongoose.Types.ObjectId.isValid(val),
//   { message: "Invalid ObjectId" },
// );

export const IdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" });

export const MoneySchema = z.coerce
  .number()
  .int()
  .min(0, "Price must be at least 0");

export const imageUrlSchema = z.string();

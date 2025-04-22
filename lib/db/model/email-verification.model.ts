import { emailVerificationTypeSchema } from "@/features/auth/auth.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof emailVerificationTypeSchema>;

export interface EmailVerificationTokenModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const emailVerificationTokenSchema = new Schema<EmailVerificationTokenModel>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    sentAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

emailVerificationTokenSchema.index({ token: 1 }, { unique: true });
emailVerificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 10 },
);

const EmailVerificationToken =
  (models.EmailVerificationToken as Model<EmailVerificationTokenModel>) ||
  model<EmailVerificationTokenModel>(
    "EmailVerificationToken",
    emailVerificationTokenSchema,
  );

export default EmailVerificationToken;

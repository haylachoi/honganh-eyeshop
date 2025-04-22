import { passwordResetTokenTypeSchema } from "@/features/auth/auth.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof passwordResetTokenTypeSchema>;

export interface PasswordResetTokenModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const passwordResetTokenSchema = new Schema<PasswordResetTokenModel>(
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

passwordResetTokenSchema.index({ token: 1 }, { unique: true });
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 10 });

const PasswordResetToken =
  (models.PasswordResetToken as Model<PasswordResetTokenModel>) ||
  model<PasswordResetTokenModel>(
    "PasswordResetToken",
    passwordResetTokenSchema,
  );

export default PasswordResetToken;

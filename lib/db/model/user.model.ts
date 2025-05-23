import { UserType } from "@/features/users/user.types";
import { Model, model, models, Schema, Document } from "mongoose";

export interface UserModel extends Document, Omit<UserType, "id"> {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    password: { type: String, required: false },
    salt: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    provider: { type: String },
    providerId: { type: String },
    shippingAddress: {
      type: {
        address: { type: String },
        ward: { type: String },
        district: { type: String },
        city: { type: String },
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

const User =
  (models.User as Model<UserModel>) || model<UserModel>("User", userSchema);

export default User;

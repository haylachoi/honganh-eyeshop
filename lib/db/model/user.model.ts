import { UserType } from "@/features/auth/auth.type";
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
    phone: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

const User =
  (models.User as Model<UserModel>) || model<UserModel>("User", userSchema);

export default User;

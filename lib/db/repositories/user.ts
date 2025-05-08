"server only";

import { connectToDatabase } from "..";
import User from "@/lib/db/model/user.model";
import { ERROR_MESSAGES } from "@/constants";
import { Id } from "@/types";
import { SignUpType } from "@/features/auth/auth.type";
import {
  safeAdminUserInfoSchema,
  userSchema,
} from "@/features/users/user.validator";
import { NotFoundError, ValidationError } from "@/lib/error";
import { FilterQuery, UpdateQuery } from "mongoose";
import { safeUserInfoSchema } from "@/features/users/user.validator";
import { UserType } from "@/features/users/user.types";

// danger: cache user when use CDN can leak sensitive data
const getAllUsers = async () => {
  await connectToDatabase();
  const user = await User.find().sort().lean();

  const result = userSchema.array().parse(user);

  return result;
};

const getAllSafeAdminUsers = async () => {
  await connectToDatabase();
  const user = await User.find({
    role: {
      $in: ["admin", "seller"],
    },
  })
    .sort()
    .lean();

  const result = safeAdminUserInfoSchema.array().parse(user);

  return result;
};

const getUserById = async (id: Id) => {
  await connectToDatabase();
  const result = await User.findById(id).lean();
  return result ? userSchema.parse(result) : null;
};

const getSafeUserById = async ({ id }: { id: Id }) => {
  await connectToDatabase();
  const result = await User.findById(id).lean();

  return result ? safeUserInfoSchema.parse(result) : null;
};

const getUserByEmail = async ({
  email,
  requireVerified = false,
}: {
  email: string;
  requireVerified?: boolean;
}) => {
  await connectToDatabase();
  const query: FilterQuery<UserType> = { email };
  if (requireVerified) {
    query.isVerified = true;
  }
  const result = await User.findOne(query).lean();
  return result ? userSchema.parse(result) : null;
};

const createUser = async (input: SignUpType) => {
  await connectToDatabase();
  const result = await User.create(input);
  const user = userSchema.parse(result);
  return user;
};

export const updateUserInfo = async ({
  query,
  updateQuery,
}: {
  query: FilterQuery<UserType>;
  updateQuery: UpdateQuery<UserType>;
}) => {
  await connectToDatabase();
  const result = await User.findOneAndUpdate(query, updateQuery, {
    new: true,
  });
  if (!result) {
    throw new NotFoundError({
      resource: "user",
      message: ERROR_MESSAGES.USER.NOT_FOUND,
    });
  }

  return { success: true };
};

const changePassword = async ({
  email,
  id,
  password,
  salt,
}: {
  email?: string;
  id?: string;
  password: string;
  salt: string;
}) => {
  await connectToDatabase();

  if (!email && !id) {
    throw new ValidationError({
      resource: "user",
      message: "Email hoặc id phải được cung cấp",
    });
  }
  const filter = email ? { email } : { _id: id };

  const user = await User.findOneAndUpdate(
    filter,
    { password, salt },
    { new: true },
  );

  if (!user) {
    throw new NotFoundError({
      resource: "user",
      message: ERROR_MESSAGES.USER.NOT_FOUND,
    });
  }

  return {
    success: true,
  };
};

const deleteUsers = async ({ ids }: { ids: Id | Id[] }) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const existingUsers = await User.find({ _id: { $in: idsArray } });
  if (existingUsers.length !== idsArray.length) {
    throw new NotFoundError({
      resource: "user",
      message: ERROR_MESSAGES.USER.NOT_FOUND,
    });
  }

  await User.deleteMany({ _id: { $in: idsArray } });

  return ids;
};

const lockUsers = async ({ ids }: { ids: Id | Id[] }) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const existingUsers = await User.find({ _id: { $in: idsArray } });
  if (existingUsers.length !== idsArray.length) {
    throw new NotFoundError({
      resource: "user",
      message: ERROR_MESSAGES.USER.NOT_FOUND,
    });
  }

  await User.updateMany({ _id: { $in: idsArray } }, { isLocked: true });

  return ids;
};

const unlockUsers = async ({ ids }: { ids: Id | Id[] }) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const existingUsers = await User.find({ _id: { $in: idsArray } });
  if (existingUsers.length !== idsArray.length) {
    throw new NotFoundError({
      resource: "user",
      message: ERROR_MESSAGES.USER.NOT_FOUND,
    });
  }

  await User.updateMany({ _id: { $in: idsArray } }, { isLocked: false });

  return ids;
};

const userRepository = {
  getAllUsers,
  getAllSafeAdminUsers,
  getUserByEmail,
  getUserById,
  getSafeUserById,
  createUser,
  updateUserInfo,
  changePassword,
  deleteUsers,
  lockUsers,
  unlockUsers,
};

export default userRepository;

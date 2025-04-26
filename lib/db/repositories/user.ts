"server only";

import { connectToDatabase } from "..";
import User from "@/lib/db/model/user.model";
import { ERROR_MESSAGES } from "@/constants";
import { Id } from "@/types";
import { SignUpType } from "@/features/auth/auth.type";
import { userSchema } from "@/features/users/user.validator";
import { NotFoundError, ValidationError } from "@/lib/error";
import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import EmailVerificationToken from "../model/email-verification.model";
import PasswordResetToken from "../model/password-reset-token.model";
import {
  safeUserInfoFromSessionSchema,
  safeUserInfoSchema,
} from "@/features/users/user.validator";
import { UserType } from "@/features/users/user.types";

// danger: cache user when use CDN can leak sensitive data
const getAllUsers = async () => {
  await connectToDatabase();
  const user = await User.find().sort().lean();

  const result = userSchema.array().parse(user);

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

// todo: this is validate token, should move to utils or service
const verifyUserByToken = async ({ token }: { token: string }) => {
  await connectToDatabase();
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const verifiedToken = await EmailVerificationToken.findOneAndDelete(
      {
        token,
        expiresAt: { $gt: new Date() },
      },
      { session },
    );
    if (!verifiedToken) {
      throw new NotFoundError({
        resource: "verifyToken",
        message: ERROR_MESSAGES.VERYFY_TOKEN.NOT_FOUND_OR_EXPIRED,
      });
    }
    const result = await User.findOneAndUpdate(
      { email: verifiedToken.email },
      { $set: { isVerified: true } },
      { session, new: true },
    );

    if (!result) {
      throw new NotFoundError({
        resource: "user",
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      });
    }

    await session.commitTransaction();
    const user = safeUserInfoFromSessionSchema.parse(result);
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    await session.abortTransaction();
    let message = "Có lỗi xảy ra khi xác minh";
    if (error instanceof NotFoundError) {
      message = error.message;
    }

    return {
      success: false,
      message,
    };
  } finally {
    await session.endSession();
  }
};

const validateResetPasswordToken = async ({ token }: { token: string }) => {
  await connectToDatabase();
  const sesetToken = await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });
  if (!sesetToken) {
    return {
      success: false,
      message: "Token không hợp lệ",
    };
  }

  return {
    success: true,
    data: {
      id: sesetToken._id.toString(),
      email: sesetToken.email,
    },
  };
};

const deleteUser = async (ids: string | string[]) => {
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

const userRepository = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  getSafeUserById,
  createUser,
  updateUserInfo,
  changePassword,
  verifyUserByToken,
  validateResetPasswordToken,

  // updateUser,
  deleteUser,
};

export default userRepository;

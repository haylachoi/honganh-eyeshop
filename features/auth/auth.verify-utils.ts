import { ERROR_MESSAGES } from "@/constants";
import { connectToDatabase } from "@/lib/db";
import EmailVerificationToken from "@/lib/db/model/email-verification.model";
import PasswordResetToken from "@/lib/db/model/password-reset-token.model";
import User from "@/lib/db/model/user.model";
import { NotFoundError } from "@/lib/error";
import mongoose from "mongoose";
import { safeUserInfoFromSessionSchema } from "../users/user.validator";

export const validatePasswordResetToken = async ({
  token,
}: {
  token: string;
}) => {
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

export const verifyUserByToken = async ({ token }: { token: string }) => {
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

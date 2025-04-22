import { PasswordResetTokenDbInputType } from "@/features/auth/auth.type";
import { Id } from "@/types";
import PasswordResetToken from "../model/password-reset-token.model";
import { connectToDatabase } from "..";

const createPasswordResetToken = async (
  input: PasswordResetTokenDbInputType,
) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.create(input);

  return passwordResetToken;
};

export const findPasswordResetTokenByToken = async (token: string) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.findOne({
    token,
  });

  return passwordResetToken;
};

export const findLastPasswordResetTokenByEmail = async ({
  email,
}: {
  email: string;
}) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.findOne({
    email,
  })
    .sort({ expiresAt: -1 })
    .limit(1);

  return passwordResetToken;
};

export const findPasswordResetTokenById = async (id: string) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.findById(id);

  return passwordResetToken;
};

export const updateSentAt = async ({
  id,
  sentAt,
}: {
  id: Id;
  sentAt: Date;
}) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.findByIdAndUpdate(id, {
    sentAt,
  });

  return passwordResetToken;
};

export const deletePasswordResetTokenById = async (id: string) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.findByIdAndDelete(id);

  return passwordResetToken;
};

export const deleteByEmail = async ({ email }: { email: string }) => {
  await connectToDatabase();
  const passwordResetToken = await PasswordResetToken.deleteMany({
    email,
  });

  return passwordResetToken;
};

export const passwordResetTokenRepository = {
  createPasswordResetToken,
  findPasswordResetTokenByToken,
  findLastPasswordResetTokenByEmail,
  findPasswordResetTokenById,
  updateSentAt,
  deletePasswordResetTokenById,
  deleteByEmail,
};

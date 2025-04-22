import { EmailVerificationDbInputType } from "@/features/auth/auth.type";
import EmailVerificationToken from "../model/email-verification.model";
import { Id } from "@/types";
import { connectToDatabase } from "..";

const createEmailVerification = async (input: EmailVerificationDbInputType) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.create(input);

  return emailVerification;
};

const findEmailVerificationByToken = async (token: string) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.findOne({
    token,
  });

  return emailVerification;
};

const findLastEmailVerificationByEmail = async ({
  email,
}: {
  email: string;
}) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.findOne({
    email,
  })
    .sort({ expiresAt: -1 })
    .limit(1);

  return emailVerification;
};

const findEmailVerificationById = async (id: string) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.findById(id);

  return emailVerification;
};

const updateSentAt = async ({ id, sentAt }: { id: Id; sentAt: Date }) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.findByIdAndUpdate(id, {
    sentAt,
  });

  return emailVerification;
};

const deleteEmailVerificationById = async (id: string) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.findByIdAndDelete(id);

  return emailVerification;
};

const deleteByEmail = async ({ email }: { email: string }) => {
  await connectToDatabase();
  const emailVerification = await EmailVerificationToken.deleteMany({
    email,
  });

  return emailVerification;
};

export const emailVerificationTokenRepository = {
  createEmailVerification,
  findEmailVerificationByToken,
  findLastEmailVerificationByEmail,
  findEmailVerificationById,
  updateSentAt,
  deleteEmailVerificationById,
  deleteByEmail,
};

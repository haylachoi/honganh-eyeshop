import { z } from "zod";
import {
  emailVerificationTypeSchema,
  passwordResetTokenTypeSchema,
  safeUserInfoSchema,
  signInInputSchema,
  signUpInputSchema,
  signUpSchema,
  userSchema,
  userWithoutPasswordSchema,
} from "./auth.validator";

export type SignUpInputType = z.infer<typeof signUpInputSchema>;
export type SignUpType = z.output<typeof signUpSchema>;

export type SignInInputType = z.infer<typeof signInInputSchema>;

export type UserType = z.infer<typeof userSchema>;
export type UserWithoutPasswordType = z.infer<typeof userWithoutPasswordSchema>;

export type SafeUserInfo = z.infer<typeof safeUserInfoSchema>;

export type EmailVerificationType = z.infer<typeof emailVerificationTypeSchema>;
export type EmailVerificationDbInputType = Omit<EmailVerificationType, "id">;

export type PasswordResetTokenType = z.infer<
  typeof passwordResetTokenTypeSchema
>;

export type PasswordResetTokenDbInputType = Omit<PasswordResetTokenType, "id">;

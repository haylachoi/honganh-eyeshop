import { z } from "zod";
import {
  emailVerificationTypeSchema,
  passwordResetTokenTypeSchema,
  signInInputSchema,
  signUpInputSchema,
  signUpSchema,
  userDbInputFromProviderSchema,
  userWithoutPasswordSchema,
} from "./auth.validator";

export type SignUpInputType = z.infer<typeof signUpInputSchema>;
export type SignUpType = z.output<typeof signUpSchema>;

export type UserDbInputFromProviderType = z.infer<
  typeof userDbInputFromProviderSchema
>;

export type SignInInputType = z.infer<typeof signInInputSchema>;

export type UserWithoutPasswordType = z.infer<typeof userWithoutPasswordSchema>;

export type EmailVerificationType = z.infer<typeof emailVerificationTypeSchema>;
export type EmailVerificationDbInputType = Omit<EmailVerificationType, "id">;

export type PasswordResetTokenType = z.infer<
  typeof passwordResetTokenTypeSchema
>;

export type PasswordResetTokenDbInputType = Omit<PasswordResetTokenType, "id">;

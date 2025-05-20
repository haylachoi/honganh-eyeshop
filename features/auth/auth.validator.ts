import { MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { AUTH_PROVIDERS_TYPE_LIST } from "../users/user.constants";

export const userNameSchema = z.string().min(2).trim();
export const userEmailSchema = z.string().min(3).trim();
export const userPhoneSchema = z.string().min(5).trim();
const roleSchema = z.string().min(2).trim();
const avatarSchema = z.string().trim().optional();
const passwordSchema = z.string().min(2).trim();
const saltSchema = z.string();

export const signInInputSchema = z.object({
  email: userEmailSchema,
  password: passwordSchema,
});

export const userSchema = z
  .object({
    _id: MongoIdSchema,
    name: userNameSchema,
    email: userEmailSchema,
    role: roleSchema,
    avatar: avatarSchema,
    phone: userPhoneSchema,
    password: passwordSchema,
    salt: saltSchema,
    isVerified: z.boolean().optional(),
  })
  .strip()
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const userWithoutPasswordSchema = z
  .object({
    // _id: IdSchema,
    _id: MongoIdSchema,
    name: userNameSchema,
    avatar: avatarSchema,
    role: roleSchema,
    email: userEmailSchema,
    phone: userPhoneSchema,
  })
  .strip()
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const signUpInputSchema = signInInputSchema
  .extend({
    name: userNameSchema,
    phone: userPhoneSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export const signUpSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  role: roleSchema,
  phone: userPhoneSchema,
  password: passwordSchema,
  salt: saltSchema,
  isVerified: z.boolean(),
  provider: z.enum(AUTH_PROVIDERS_TYPE_LIST),
  isLocked: z.boolean(),
});

export const userDbInputFromProviderSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  role: roleSchema,
  provider: z.enum(AUTH_PROVIDERS_TYPE_LIST),
  providerId: z.string(),
  isVerified: z.boolean(),
});

export const emailVerificationTypeSchema = z
  .object({
    _id: MongoIdSchema,
    email: userEmailSchema,
    token: z.string(),
    sentAt: z.date(),
    expiresAt: z.date(),
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const passwordResetTokenTypeSchema = z
  .object({
    _id: MongoIdSchema,
    email: userEmailSchema,
    token: z.string(),
    sentAt: z.date(),
    expiresAt: z.date(),
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

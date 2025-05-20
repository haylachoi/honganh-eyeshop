import {
  IdSchema,
  MongoIdSchema,
  passwordSchema,
  phoneSchema,
} from "@/lib/validator";
import { z } from "zod";
import { AUTH_PROVIDERS_TYPE_LIST } from "./user.constants";

export const userNameSchema = z.string().min(2).trim();
export const userEmailSchema = z.string().min(3).trim();
const saltSchema = z.string();
export const shippingAddressSchema = z.object({
  address: z.string().trim(),
  ward: z.string().trim(),
  district: z.string().trim(),
  city: z.string().trim(),
});

const roleSchema = z.string().min(2).trim();
const avatarSchema = z.string().trim().optional();

const baseUserSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  role: roleSchema,
  avatar: avatarSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema.optional(),
  salt: saltSchema.optional(),
  isVerified: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  shippingAddress: shippingAddressSchema.optional(),
  providerId: z.string().optional(),
  provider: z.enum(AUTH_PROVIDERS_TYPE_LIST).optional(),
});

export const userSchema = baseUserSchema
  .extend({
    _id: MongoIdSchema,
  })
  .strip()
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const adminUserInputSchema = z
  .object({
    name: userNameSchema,
    email: userEmailSchema,
    phone: phoneSchema,
    role: roleSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const safeUserInfoFromSessionSchema = baseUserSchema
  .pick({
    name: true,
    role: true,
    avatar: true,
  })
  .extend({
    id: IdSchema,
  });

export const safeUserInfoSchema = baseUserSchema
  .pick({
    name: true,
    role: true,
    avatar: true,
    phone: true,
    shippingAddress: true,
    provider: true,
  })
  .extend({
    _id: MongoIdSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const safeAdminUserInfoSchema = baseUserSchema
  .omit({
    password: true,
    salt: true,
  })
  .extend({
    _id: MongoIdSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const customerInfoUpdateSchema = z.object({
  id: IdSchema,
  name: z.string().min(2).trim(),
  phone: phoneSchema.optional(),
});

export const shippingAddressUpdateSchema = shippingAddressSchema.extend({
  id: IdSchema,
});

export const passwordChangeSchema = z
  .object({
    id: IdSchema,
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmNewPassword"],
  });

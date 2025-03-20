import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

const nameSchema = z.string().min(2).trim();
const roleSchema = z.string().min(2).trim();
const emailSchema = z.string().min(3).trim();
const avatarSchema = z.string().trim().optional();
const phoneSchema = z.string().min(5).trim();
const passwordSchema = z.string().min(2).trim();
const saltSchema = z.string();

export const signInInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const userSchema = z
  .object({
    // _id: IdSchema,
    _id: MongoIdSchema,
    name: nameSchema,
    email: emailSchema,
    role: roleSchema,
    avatar: avatarSchema,
    phone: phoneSchema,
    password: passwordSchema,
    salt: saltSchema,
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
    name: nameSchema,
    avatar: avatarSchema,
    role: roleSchema,
    email: emailSchema,
    phone: phoneSchema,
  })
  .strip()
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const signUpInputSchema = signInInputSchema
  .extend({
    name: nameSchema,
    role: roleSchema.optional(),
    phone: phoneSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
  phone: phoneSchema,
  password: passwordSchema,
  salt: saltSchema,
});

export const profileUpdateSchema = z.object({
  id: IdSchema,
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
  phone: phoneSchema,
});

export const safeUserInfoSchema = z.object({
  id: IdSchema,
  name: nameSchema,
  role: roleSchema,
  avatar: avatarSchema,
});

import { IdSchema, MongoIdSchema, phoneSchema } from "@/lib/validator";
import { z } from "zod";

export const userNameSchema = z.string().min(2).trim();
export const userEmailSchema = z.string().min(3).trim();
export const userPhoneSchema = z.string().min(5).trim();

const roleSchema = z.string().min(2).trim();
const avatarSchema = z.string().trim().optional();

export const safeUserInfoFromSessionSchema = z.object({
  id: IdSchema,
  name: userNameSchema,
  role: roleSchema,
  avatar: avatarSchema,
});

export const safeUserInfoSchema = z
  .object({
    _id: MongoIdSchema,
    name: userNameSchema,
    role: roleSchema,
    avatar: avatarSchema,
    phone: phoneSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

export const customerInfoUpdateSchema = z.object({
  id: IdSchema,
  name: z.string().min(2).trim(),
  phone: z.string().min(5).trim(),
});

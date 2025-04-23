import { z } from "zod";
import {
  customerInfoUpdateSchema,
  passwordChangeSchema,
  safeUserInfoFromSessionSchema,
  safeUserInfoSchema,
  shippingAddressUpdateSchema,
  userSchema,
} from "./user.validator";

export type SafeUserInfoFromSession = z.infer<
  typeof safeUserInfoFromSessionSchema
>;

export type UserType = z.infer<typeof userSchema>;
export type SafeUserInfo = z.infer<typeof safeUserInfoSchema>;
export type CustomerInfoUpdateType = z.infer<typeof customerInfoUpdateSchema>;
export type ShippingAddressUpdateType = z.infer<
  typeof shippingAddressUpdateSchema
>;

export type PasswordChangeType = z.infer<typeof passwordChangeSchema>;

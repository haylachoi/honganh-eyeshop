import { z } from "zod";
import {
  customerInfoUpdateSchema,
  safeUserInfoFromSessionSchema,
  safeUserInfoSchema,
} from "./user.validator";

export type SafeUserInfoFromSession = z.infer<
  typeof safeUserInfoFromSessionSchema
>;

export type SafeUserInfo = z.infer<typeof safeUserInfoSchema>;
export type CustomerInfoUpdateType = z.infer<typeof customerInfoUpdateSchema>;

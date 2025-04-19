import { getSession } from "../session/session.core";
import { safeUserInfoSchema } from "./auth.validator";

export const auth = async () => {
  const sessionResult = await getSession();

  if (!sessionResult.success) return;
  return safeUserInfoSchema.parse(sessionResult.data);
};

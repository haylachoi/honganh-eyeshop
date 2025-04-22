import { getSession } from "../session/session.core";
import { safeUserInfoFromSessionSchema } from "../users/user.validator";

export const auth = async () => {
  const sessionResult = await getSession();

  if (!sessionResult.success) return;
  return safeUserInfoFromSessionSchema.parse(sessionResult.data);
};

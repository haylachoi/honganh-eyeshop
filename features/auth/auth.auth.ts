import userRepository from "@/lib/db/repositories/user";
import { createSession, getSession } from "../session/session.core";
import { safeUserInfoFromSessionSchema } from "../users/user.validator";
import { Role } from "../authorization/authorization.constants";
import { ERROR_MESSAGES } from "@/constants/messages.constants";

export const auth = async () => {
  const sessionResult = await getSession();

  if (!sessionResult.success) return;
  return safeUserInfoFromSessionSchema.parse(sessionResult.data);
};

export const loginWithGoogle = async ({
  email,
  name,
  providerId,
}: {
  email: string;
  name: string;
  providerId: string;
}) => {
  const user = await userRepository.getUserByEmail({
    email,
    requireVerified: false,
  });

  if (!user) {
    const role: Role = "customer";
    const user = await userRepository.createUserFromProvider({
      email,
      name,
      role,
      isVerified: true,
      provider: "google",
      providerId,
    });

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    await createSession(payload);
    return {
      success: true,
    };
  }

  if (user.isLocked) {
    return {
      success: false,
      message: ERROR_MESSAGES.USER.LOCKED,
    };
  }

  await createSession({
    id: user.id,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  });

  return {
    success: true,
  };
};

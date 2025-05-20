"use server";

import { getAuthActionClient } from "@/lib/actions";
import {
  adminUserInputSchema,
  customerInfoUpdateSchema,
  passwordChangeSchema,
  shippingAddressUpdateSchema,
} from "./user.validator";
import userRepository from "@/lib/db/repositories/user";
import { z } from "zod";
import { uploadFile } from "@/lib/utils/upload.utils";
import { createSession } from "../session/session.core";
import { auth } from "../auth/auth.auth";
import { NotFoundError } from "@/lib/error";
import { revalidateTag } from "next/cache";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import next_cache from "@/cache";
import { generateSalt, hashPassword } from "@/lib/utils";
import { createVerificationToken } from "../auth/auth.utils";
import { emailVerificationTokenRepository } from "@/lib/db/repositories/email-verification";
import { VERIFYTOKEN_DURATION_IN_MILISECOND } from "../auth/auth.constants";
import { sendVerificationEmail } from "../email/email.utils";
import { IdSchema } from "@/lib/validator";
import { ADMIN_ROLES } from "../authorization/authorization.constants";
import { ERROR_MESSAGES } from "@/constants/messages.constants";

const cacheTag = CACHE_CONFIG.USERS.ALL.TAGS[0];

const resource = "user";

export const createAdminAccountAction = getAuthActionClient({
  resource,
  action: "create",
  scope: "all",
})
  .metadata({
    actionName: "createAdminAccount",
  })
  .schema(adminUserInputSchema)
  .action(async ({ parsedInput }) => {
    const salt = generateSalt();

    const input: Parameters<typeof userRepository.createUser>[0] = {
      name: parsedInput.name,
      email: parsedInput.email,
      phone: parsedInput.phone,
      salt,
      role: parsedInput.role,
      password: await hashPassword({
        password: parsedInput.password,
        salt,
      }),
      isVerified: false,
      isLocked: false,
      provider: "credentials",
    };

    const user = await userRepository.createUser(input);
    revalidateTag(cacheTag);

    const token = createVerificationToken();

    await emailVerificationTokenRepository.createEmailVerification({
      email: parsedInput.email,
      token,
      expiresAt: new Date(Date.now() + VERIFYTOKEN_DURATION_IN_MILISECOND),
      sentAt: new Date(),
    });

    await sendVerificationEmail({
      email: parsedInput.email,
      token,
      name: user.name,
    });

    return user.id;
  });

export const updateCustomerInfoAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "own",
})
  .metadata({
    actionName: "updateCustomerInfo",
  })
  .schema(customerInfoUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { id, name, phone } = parsedInput;

    const result = await userRepository.updateUserInfo({
      query: { _id: id },
      updateQuery: {
        $set: {
          name,
          phone,
        },
      },
    });

    const user = await auth();
    if (result.success && user) {
      await createSession({
        id: id,
        name: name,
        role: user.role,
        avatar: user.avatar,
      });
    }

    revalidateTag(cacheTag);
    return result;
  });

export const updateCustomerAvatarAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "own",
})
  .metadata({
    actionName: "updateCustomerAvatar",
  })
  .schema(
    z.object({
      id: z.string(),
      avatar: z.instanceof(File),
    }),
  )
  .action(async ({ parsedInput: { id, avatar } }) => {
    const user = await next_cache.users.getSafeUserInfo({ id });
    if (!user) {
      throw new NotFoundError({
        resource: "user",
      });
    }

    const path = await uploadFile({
      file: avatar,
      fileName: `${user.id}-avatar`,
      to: "users",
    });

    const result = await userRepository.updateUserInfo({
      query: { _id: id },
      updateQuery: {
        $set: {
          avatar: path,
        },
      },
    });

    if (result.success) {
      await createSession({
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: path,
      });
    }

    revalidateTag(cacheTag);

    return result;
  });

export const updateCustomerShippingAddressAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "own",
})
  .metadata({
    actionName: "updateCustomerShippingAddress",
  })
  .schema(shippingAddressUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...shippingAddress } = parsedInput;

    const result = await userRepository.updateUserInfo({
      query: { _id: id },
      updateQuery: {
        $set: {
          shippingAddress: shippingAddress,
        },
      },
    });

    revalidateTag(cacheTag);
    return result;
  });

export const changeCustomerPasswordAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "own",
})
  .metadata({
    actionName: "changeCustomerPassword",
  })
  .schema(passwordChangeSchema)
  .action(
    async ({
      parsedInput,
    }): Promise<{ success: true } | { success: false; message?: string }> => {
      const { id, newPassword, currentPassword } = parsedInput;
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new NotFoundError({
          resource: "user",
        });
      }

      if (!user.password || !user.salt) {
        return {
          success: false,
          message: ERROR_MESSAGES.USER.NOT_CREDENTIALS,
        };
      }

      const userHashedPw = await hashPassword({
        password: currentPassword,
        salt: user.salt,
      });

      if (userHashedPw !== user.password) {
        return {
          success: false,
          message: "Mật khẩu hiện tại không khớp",
        };
      }

      const salt = generateSalt();

      const result = await userRepository.changePassword({
        id: id,
        password: await hashPassword({
          password: newPassword,
          salt,
        }),
        salt,
      });

      revalidateTag(cacheTag);
      return result;
    },
  );

export const lockUserAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "all",
})
  .metadata({
    actionName: "lockUser",
  })
  .schema(z.object({ ids: z.union([IdSchema, z.array(IdSchema)]) }))
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

    const result = await userRepository.lockUsers({
      ids,
    });

    revalidateTag(cacheTag);
    return result;
  });

export const unlockUserAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "all",
})
  .metadata({
    actionName: "unlockUser",
  })
  .schema(z.object({ ids: z.union([IdSchema, z.array(IdSchema)]) }))
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

    const result = await userRepository.unlockUsers({
      ids,
    });

    revalidateTag(cacheTag);
    return result;
  });

export const deleteUserAction = getAuthActionClient({
  resource,
  action: "delete",
  scope: "all",
})
  .metadata({
    actionName: "deleteUser",
  })
  .schema(z.object({ ids: z.union([IdSchema, z.array(IdSchema)]) }))
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

    const result = await userRepository.deleteUsers({
      ids,
    });

    revalidateTag(cacheTag);
    return result;
  });

export const changeUserRoleAction = getAuthActionClient({
  resource,
  action: "modify",
  scope: "all",
})
  .metadata({
    actionName: "changeUserRole",
  })
  .schema(z.object({ id: IdSchema, role: z.enum(ADMIN_ROLES) }))
  .action(async ({ parsedInput }) => {
    const { id, role } = parsedInput;

    const result = await userRepository.updateUserInfo({
      query: { _id: id },
      updateQuery: {
        $set: {
          role,
        },
      },
    });

    revalidateTag(cacheTag);
    return result;
  });

"use server";

import { getAuthActionClient } from "@/lib/actions";
import {
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

const cacheTag = CACHE_CONFIG.USERS.ALL.TAGS[0];

export const updateCustomerInfoAction = getAuthActionClient({
  resource: "user",
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
  resource: "user",
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
  resource: "user",
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
  resource: "user",
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

      const hashedPw = await hashPassword(currentPassword, user.salt);
      if (hashedPw !== user.password) {
        return {
          success: false,
          message: "Mật khẩu hiện tại không khớp",
        };
      }

      const salt = generateSalt();

      const result = await userRepository.changePassword({
        id: id,
        password: await hashPassword(newPassword, salt),
        salt,
      });

      revalidateTag(cacheTag);
      return result;
    },
  );

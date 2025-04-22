"use server";

import { getAuthActionClient } from "@/lib/actions";
import { customerInfoUpdateSchema } from "./user.validator";
import userRepository from "@/lib/db/repositories/user";
import { z } from "zod";
import { uploadFile } from "@/lib/utils/upload.utils";
import { createSession } from "../session/session.core";
import { auth } from "../auth/auth.auth";

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
    const path = await uploadFile({
      file: avatar,
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

    const user = await auth();
    if (result.success && user) {
      await createSession({
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: path,
      });
    }
    return result;
  });

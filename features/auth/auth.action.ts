"use server";

import { actionClient, customerActionClient } from "@/lib/actions";
import { signUpInputSchema, signInInputSchema } from "./auth.validator";
import userRepository from "@/lib/db/repositories/user";
import { comparePasswords, generateSalt, hashPassword } from "@/lib/utils";
import { createSession, deleteSession } from "../session/session.core";

export const signUp = actionClient
  .metadata({
    actionName: "signUp",
  })
  .schema(signUpInputSchema)
  .action(async ({ parsedInput }) => {
    const salt = generateSalt();
    const input = {
      name: parsedInput.name,
      email: parsedInput.email,
      phone: parsedInput.phone,
      salt,
      role: "admin",
      password: await hashPassword(parsedInput.password, salt),
    };

    const user = await userRepository.createUser(input);
    return user.id;
  });

export const signIn = actionClient
  .metadata({
    actionName: "signIn",
  })
  .schema(signInInputSchema)
  .action(async ({ parsedInput }) => {
    const user = await userRepository.getUserByEmail(parsedInput.email);
    console.log("user", user);
    if (!user) {
      return false;
    }
    const isMatched = await comparePasswords({
      password: parsedInput.password,
      salt: user.salt,
      hashedPassword: user.password,
    });

    if (isMatched) {
      await createSession({
        id: user.id,
        name: user.name,
        role: user.role,
      });
    }

    return isMatched;
  });

export const logoutAction = customerActionClient
  .metadata({
    actionName: "logout",
  })
  .action(async ({ ctx }) => {
    if (ctx.userId) {
      await deleteSession();
      return true;
    }
    return false;
  });

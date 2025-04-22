"use server";

import { actionClient, customerActionClient } from "@/lib/actions";
import { signUpInputSchema, signInInputSchema } from "./auth.validator";
import userRepository from "@/lib/db/repositories/user";
import { comparePasswords, generateSalt, hashPassword } from "@/lib/utils";
import { createSession, deleteSession } from "../session/session.core";
import { Role } from "../authorization/authorization.constants";
import { emailVerificationTokenRepository } from "@/lib/db/repositories/email-verification";
import { createVerificationToken } from "./auth.utils";
import {
  SEND_EMAIL_COOLDOWN_MS,
  VERIFYTOKEN_DURATION_IN_MILISECOND,
} from "./auth.constants";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../email/email.utils";
import { ERROR_MESSAGES } from "@/constants";
import { z } from "zod";
import { passwordResetTokenRepository } from "@/lib/db/repositories/password-reset-token";
import { validatePasswordResetToken } from "./auth.verify-utils";

export const signUpAction = actionClient
  .metadata({
    actionName: "signUp",
  })
  .schema(signUpInputSchema)
  .action(async ({ parsedInput }) => {
    const salt = generateSalt();
    const role: Role = "customer";
    const input = {
      name: parsedInput.name,
      email: parsedInput.email,
      phone: parsedInput.phone,
      salt,
      role,
      password: await hashPassword(parsedInput.password, salt),
      isverified: false,
    };
    const user = await userRepository.createUser(input);

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

export const sendVerificationEmailAction = actionClient
  .metadata({
    actionName: "sendVerificationEmail",
  })
  .schema(
    z.object({
      email: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const user = await userRepository.getUserByEmail({
      email,
      requireVerified: false,
    });

    // Kiểm tra tài khoản tồn tại
    if (!user) {
      return {
        success: false,
        message: "Tài khoản không tồn tại",
      };
    }

    // Kiểm tra tài khoản đã được xác minh chưa
    if (user.isVerified) {
      return {
        success: false,
        message: "Tài khoản đã được xác minh",
      };
    }

    const now = Date.now();
    const duration = VERIFYTOKEN_DURATION_IN_MILISECOND;
    const cooldown = SEND_EMAIL_COOLDOWN_MS;
    const reuseThreshold = duration / 2;

    // Tìm token gần nhất
    const lastToken =
      await emailVerificationTokenRepository.findLastEmailVerificationByEmail({
        email,
      });

    // Kiểm tra token còn hiệu lực
    const isTokenValid =
      lastToken && new Date(lastToken.expiresAt).getTime() > now;

    if (isTokenValid) {
      const sentAtMs = new Date(
        lastToken.sentAt ?? lastToken.createdAt,
      ).getTime();
      const createdAtMs = new Date(lastToken.createdAt).getTime();

      // Kiểm tra cooldown
      const timeSinceLastSent = now - sentAtMs;
      if (timeSinceLastSent < cooldown) {
        const remainingSeconds = Math.ceil(
          (cooldown - timeSinceLastSent) / 1000,
        );
        return {
          success: false,
          message: `Vui lòng đợi khoảng ${remainingSeconds} giây trước khi gửi lại email.`,
          timeLeft: remainingSeconds,
        };
      }

      // Kiểm tra có thể tái sử dụng token
      if (now - createdAtMs < reuseThreshold) {
        await emailVerificationTokenRepository.updateSentAt({
          id: lastToken.id,
          sentAt: new Date(),
        });

        await sendVerificationEmail({
          email,
          token: lastToken.token,
          name: user.name,
        });

        return {
          success: true,
          message: "Chúng tôi đã gửi lại email xác minh tài khoản cho bạn",
        };
      }
    }

    // Xóa các token cũ
    await emailVerificationTokenRepository.deleteByEmail({ email });

    // Tạo token mới
    const token = createVerificationToken();
    const expiresAt = new Date(now + duration);

    await emailVerificationTokenRepository.createEmailVerification({
      email,
      token,
      sentAt: new Date(),
      expiresAt,
    });

    await sendVerificationEmail({
      email,
      token,
      name: user.name,
    });

    return {
      success: true,
      message: "Chúng tôi đã gửi email xác minh tài khoản cho bạn",
    };
  });

export const sendPasswordResetEmailAction = actionClient
  .metadata({
    actionName: "sendPasswordResetEmail",
  })
  .schema(
    z.object({
      email: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const user = await userRepository.getUserByEmail({
      email,
      requireVerified: true,
    });

    if (!user) {
      return {
        success: false,
        message: "Tài khoản không tồn tại",
      };
    }

    const now = Date.now();
    const duration = VERIFYTOKEN_DURATION_IN_MILISECOND;
    const cooldown = SEND_EMAIL_COOLDOWN_MS;
    const reuseThreshold = duration / 2;

    // Tìm token gần nhất
    const lastToken =
      await passwordResetTokenRepository.findLastPasswordResetTokenByEmail({
        email,
      });

    // Kiểm tra token còn hiệu lực
    const isTokenValid =
      lastToken && new Date(lastToken.expiresAt).getTime() > now;

    if (isTokenValid) {
      const sentAtMs = new Date(
        lastToken.sentAt ?? lastToken.createdAt,
      ).getTime();
      const createdAtMs = new Date(lastToken.createdAt).getTime();

      // Kiểm tra cooldown
      const timeSinceLastSent = now - sentAtMs;
      if (timeSinceLastSent < cooldown) {
        const remainingSeconds = Math.ceil(
          (cooldown - timeSinceLastSent) / 1000,
        );
        return {
          success: false,
          message: `Vui lòng đợi khoảng ${remainingSeconds} giây trước khi gửi lại email.`,
          timeLeft: remainingSeconds,
        };
      }

      // Kiểm tra có thể tái sử dụng token
      if (now - createdAtMs < reuseThreshold) {
        await passwordResetTokenRepository.updateSentAt({
          id: lastToken.id,
          sentAt: new Date(),
        });

        await sendPasswordResetEmail({
          email,
          token: lastToken.token,
          name: user.name,
        });

        return {
          success: true,
          message:
            "Chúng tôi đã gửi lại email cho bạn. Vui lòng theo liên kết để đặt lại mật khẩu.",
        };
      }
    }

    // Xóa các token cũ
    await passwordResetTokenRepository.deleteByEmail({ email });

    // Tạo token mới
    const token = createVerificationToken();

    await passwordResetTokenRepository.createPasswordResetToken({
      email,
      token,
      sentAt: new Date(),
      expiresAt: new Date(now + duration),
    }); // Ngược lại, tạo token mới

    await sendPasswordResetEmail({
      email,
      token,
      name: user.name,
    });

    return {
      success: true,
      message:
        "Chúng tôi đã gửi email cho bạn. Vui lòng theo liên kết để đặt lại mật khẩu.",
    };
  });

export const resetPasswordAction = actionClient
  .metadata({
    actionName: "resetPassword",
  })
  .schema(
    z.object({
      token: z.string(),
      newPassword: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { token, newPassword } = parsedInput;

    // Xác thực token
    const validation = await validatePasswordResetToken({
      token,
    });

    if (!validation.success || !validation.data) {
      return {
        success: false,
        message: validation.message || "Token không hợp lệ",
      };
    }

    const { email, id } = validation.data;

    // Cập nhật mật khẩu
    const salt = generateSalt();
    await userRepository.changePassword({
      email,
      salt,
      password: await hashPassword(newPassword, salt),
    });

    await passwordResetTokenRepository.deletePasswordResetTokenById(id);

    return {
      success: true,
      message: "Mật khẩu đã được đặt lại thành công",
    };
  });

export const signIn = actionClient
  .metadata({
    actionName: "signIn",
  })
  .schema(signInInputSchema)
  .action(async ({ parsedInput }) => {
    const user = await userRepository.getUserByEmail({
      email: parsedInput.email,
    });
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      };
    }
    if (!user.isVerified) {
      return {
        success: false,
        message: ERROR_MESSAGES.USER.NOT_VERIFIED,
        needVerify: true,
      };
    }
    const isMatched = await comparePasswords({
      password: parsedInput.password,
      salt: user.salt,
      hashedPassword: user.password,
    });

    if (!isMatched) {
      return {
        success: false,
        message: ERROR_MESSAGES.AUTH.PASSWORD_MISMATCH,
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

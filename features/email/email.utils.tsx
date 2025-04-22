import { Resend } from "resend";
import { RESEND_KEY } from "./email.constants";
import React from "react";
import VerifyEmail from "../email/template/verify-email";
import { BASE_URL } from "@/constants";
import { getLink } from "@/lib/utils";
import PasswordResetEmail from "./template/password-reset-email";

export const resend = new Resend(RESEND_KEY);

export const sendEmail = async ({
  email,
  subject,
  react,
}: {
  email: string;
  subject: string;
  react: React.ReactNode;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Hồng Anh <onboarding@resend.dev>",
      to: [email],
      subject,
      react,
    });

    if (error) {
      console.error("Lỗi gửi email:", error);
    }

    console.log("Email đã gửi thành công", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

export const sendVerificationEmail = async ({
  email,
  token,
  name,
}: {
  email: string;
  token: string;
  name?: string;
}) => {
  await sendEmail({
    email,
    subject: "Xác minh tài khoản Hồng Anh",
    react: (
      <VerifyEmail
        name={name}
        verifyUrl={`${BASE_URL}/${getLink.user.verify({ token })}`}
      />
    ),
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
  name,
}: {
  email: string;
  token: string;
  name?: string;
}) => {
  await sendEmail({
    email,
    subject: "Đặt lại mật khẩu tài khoản Hồng Anh",
    react: (
      <PasswordResetEmail
        name={name}
        resetUrl={`${BASE_URL}/${getLink.user.resetPassword({ token })}`}
      />
    ),
  });
};

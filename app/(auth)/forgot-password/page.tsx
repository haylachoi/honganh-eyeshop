"use client";

import { EMAIL_REGEX } from "@/constants/regex";
import { sendPasswordResetEmailAction } from "@/features/auth/auth.action";
import { SEND_EMAIL_COOLDOWN_MS } from "@/features/auth/auth.constants";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SendEmailPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { execute, isPending } = useAction(sendPasswordResetEmailAction, {
    onSuccess: (data) => {
      const result = data.data;
      if (!result) return;
      if (result.success) {
        // setTimeLeft(-1000);
        setEmail("");
        toast.success(
          "Chúng tôi đã gửi email cho bạn. Vui lòng theo liên kết để đặt lại mật khẩu.",
        );
      } else {
        if (result.timeLeft) {
          setTimeLeft(result.timeLeft);
        }
        toast.error(result.message);
      }
    },
    onError: onActionError,
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timeLeft < 0) {
      setTimeLeft(SEND_EMAIL_COOLDOWN_MS / 1000);
    }
  }, [timeLeft]);

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border border-foreground">
      <h1 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h1>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder="Nhập email của bạn"
            className="w-full border px-4 py-2 rounded outline-none"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);

              // Validate realtime
              if (value.length === 0) {
                setEmailError("Email không được để trống");
              } else if (!EMAIL_REGEX.test(value)) {
                setEmailError("Email không hợp lệ");
              } else {
                setEmailError(null);
              }
            }}
            pattern={EMAIL_REGEX.source}
          />
          {emailError && (
            <p className="text-sm text-red-500 mt-1 px-4">{emailError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending || timeLeft > 0}
          onClick={() => {
            execute({ email });
          }}
          className="w-full bg-primary text-white py-2 cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Đang gửi..."
            : timeLeft > 0
              ? `Gửi lại (${timeLeft}s)`
              : "Gửi email"}
        </button>
      </div>
    </div>
  );
}

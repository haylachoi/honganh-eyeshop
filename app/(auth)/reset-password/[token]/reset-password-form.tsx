"use client";

import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { resetPasswordAction } from "@/features/auth/auth.action";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from "@/constants/regex";
import { ResetPasswordSuccess } from "@/components/shared/verified-token-result";

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const { execute, isPending } = useAction(resetPasswordAction, {
    onSuccess: (data) => {
      const result = data.data;
      if (result?.success === false) {
        toast.error(result.message);
        return;
      }

      if (result?.success === true) {
        toast.success("Đặt lại mật khẩu thành công");
        setIsSuccess(true);
      }
    },
    onError: onActionError,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <form
      action={() => {
        if (!passwordsMatch) {
          toast.error("Mật khẩu không khớp");
          return;
        }
        execute({
          token,
          newPassword: password,
        });
      }}
      className="max-w-sm mx-auto mt-20 p-6 bg-background text-foreground space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">Đặt lại mật khẩu</h1>

      {/* Mật khẩu mới */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded outline-none bg-transparent pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {password && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-4">
              {PASSWORD_REGEX.test(password) ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <div className="w-max flex gap-2 items-center">
                  <FaTimesCircle className="text-red-500 text-xl" />
                  {PASSWORD_ERROR_MESSAGE}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Xác nhận mật khẩu */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded outline-none bg-transparent pr-10"
            pattern={PASSWORD_REGEX.source}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {confirmPassword && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-4">
              {passwordsMatch ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-primary text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
};

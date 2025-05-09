"use client";

import { signUpInputSchema } from "../../../features/auth/auth.validator";
import { useAction } from "next-safe-action/hooks";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { signUpAction } from "../../../features/auth/auth.action";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import {
  LucideUser,
  LucideMail,
  LucidePhone,
  LucideLock,
  LucideEye,
  LucideEyeOff,
  LucideCheckCircle,
  LucideXCircle,
} from "lucide-react";
import { useState } from "react";
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from "@/constants/regex";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "@/constants/endpoints.constants";

export default function SignUpForm() {
  const router = useRouter();
  const { execute, isPending } = useAction(signUpAction, {
    onSuccess: () => {
      router.push(ENDPOINTS.AUTH.LOGIN);
      toast.success(TOAST_MESSAGES.AUTH.SIGN_UP.SUCCESS);
    },
    onError: onActionError,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = form.password === form.confirmPassword;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit: (formData: FormData) => void | Promise<void> = async () => {
    const parsedResult = signUpInputSchema.safeParse(form);
    if (!parsedResult.success) {
      toast.error("Email hoặc mật khẩu không hợp lệ");
      return;
    }
    execute(parsedResult.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-primary">
          Đăng ký tài khoản
        </h1>

        <form action={onSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Họ và tên</label>
            <div className="relative">
              <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="Nhập họ và tên của bạn"
                className="pl-10 w-full border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative">
              <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Nhập địa chỉ email"
                className="pl-10 w-full border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <div className="relative">
              <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="Nhập số điện thoại"
                className="pl-10 w-full border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <div className="relative">
              <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={form.password}
                onChange={onChange}
                className="pl-10 w-full border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <LucideEyeOff className="size-5" />
                ) : (
                  <LucideEye className="size-5" />
                )}
              </button>

              {form.password && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-4">
                  {PASSWORD_REGEX.test(form.password) ? (
                    <LucideCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <div className="w-max flex gap-2 items-center">
                      <LucideXCircle className="text-red-500 text-xl" />
                      <span className="text-sm text-red-500">
                        {PASSWORD_ERROR_MESSAGE}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
            <div className="relative">
              <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChange={onChange}
                className="pl-10 w-full border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <LucideEye className="size-5" />
                ) : (
                  <LucideEyeOff className="size-5" />
                )}
              </button>

              {form.confirmPassword && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-4">
                  {passwordsMatch ? (
                    <LucideCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <div className="w-max flex gap-2 items-center">
                      <LucideXCircle className="text-red-500 text-xl" />
                      <span className="text-sm text-red-500">
                        Mật khẩu không khớp
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 bg-primary text-white text-base tracking-wide rounded-none hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Đăng ký
            {isPending && <AnimateLoadingIcon />}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-primary hover:underline">
            Đăng nhập
          </a>
        </p>

        <p className="text-center text-sm mt-6 text-gray-500">
          Hồng Anh – Kính thời trang, phong cách của bạn 💖
        </p>
      </div>
    </div>
  );
}

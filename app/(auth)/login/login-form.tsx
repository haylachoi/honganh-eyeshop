"use client";

import { signInInputSchema } from "../../../features/auth/auth.validator";
import { useAction } from "next-safe-action/hooks";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { signIn } from "../../../features/auth/auth.action";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LucideMail, LucideLock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ENDPOINTS, ADMIN_ENDPOINTS } from "@/constants/endpoints.constants";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const { execute, isPending } = useAction(signIn, {
    onSuccess: (data) => {
      const result = data.data;
      if (result?.success === false) {
        if (result.needVerify) {
          router.push(ENDPOINTS.AUTH.ACTIVE_ACCOUNT);
        }
        toast.error(data.data?.message);
        return;
      }

      if (result?.success === true) {
        router.push(ADMIN_ENDPOINTS.HOME);
      }
    },
    onError: onActionError,
  });

  const [email, setEmail] = useState("hihi@gmail.com");
  const [password, setPassword] = useState("123");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: (formData: FormData) => void | Promise<void> = async () => {
    const parsedResult = signInInputSchema.safeParse({
      email,
      password,
    });
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
          Hồng Anh Kính Mắt
        </h1>

        <form action={onSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative">
              <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full border border-gray-300 rounded-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <p className="text-right text-sm">
            <Link
              href={ENDPOINTS.AUTH.FORGOT_PASSWORD}
              className="text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 bg-primary text-white text-base tracking-wide rounded-none hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Đăng nhập
            {isPending && <AnimateLoadingIcon />}
          </button>
        </form>

        <button
          type="button"
          onClick={() => (window.location.href = "/api/auth/google")}
          className="mt-4 cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-none py-2 transition"
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            height={20}
            width={20}
            className="size-5"
          />
          Đăng nhập với Google
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <a
            href={ENDPOINTS.AUTH.SIGN_UP}
            className="text-primary hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>

        <p className="text-center text-sm mt-6 text-gray-500">
          Chào mừng bạn đến với Hồng Anh – nơi chọn kính phong cách cho bạn ✨
        </p>
      </div>
    </div>
  );
}

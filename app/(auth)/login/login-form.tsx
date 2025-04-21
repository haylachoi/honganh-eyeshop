"use client";

import { useForm } from "react-hook-form";
import { SignInInputType } from "../../../features/auth/auth.type";
import { signInInputSchema } from "../../../features/auth/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { signIn } from "../../../features/auth/auth.action";
import { Input } from "@/components/ui/input";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { useRouter } from "next/navigation";
import { LucideMail, LucideLock } from "lucide-react";
import { ENDPOINTS } from "@/constants";

const defaultValues: SignInInputType = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const { execute, isPending } = useAction(signIn, {
    onSuccess: (data) => {
      if (data.data === false)
        toast.success(TOAST_MESSAGES.AUTH.LOGIN.NOT_MATCH);

      if (data.data === true) {
        router.push(ADMIN_ENDPOINTS.HOME);
      }
    },
    onError: onActionError,
  });

  const form = useForm<SignInInputType>({
    defaultValues,
    resolver: zodResolver(signInInputSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: SignInInputType) => {
    execute(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-primary">
          Hồng Anh Kính Mắt
        </h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LucideMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                      <Input
                        {...field}
                        type="email"
                        className="pl-10 border border-gray-300 focus:ring-primary focus:border-primary rounded-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                      <Input
                        {...field}
                        type="password"
                        className="pl-10 border border-gray-300 focus:ring-primary focus:border-primary rounded-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white text-base tracking-wide rounded-none"
              type="submit"
              disabled={isPending}
            >
              Đăng nhập
              {isPending && <AnimateLoadingIcon />}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <a href={ENDPOINTS.SIGN_UP} className="text-primary hover:underline">
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

"use client";

import { useForm } from "react-hook-form";
import { SignUpInputType } from "../../../features/auth/auth.type";
import { signUpInputSchema } from "../../../features/auth/auth.validator";
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
import { signUpAction } from "../../../features/auth/auth.action";
import { Input } from "@/components/ui/input";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import {
  LucideUser,
  LucideMail,
  LucidePhone,
  LucideLock,
  LucideShieldCheck,
} from "lucide-react";

const defaultValues: SignUpInputType = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm() {
  const { execute, isPending } = useAction(signUpAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.AUTH.SIGN_UP.SUCCESS);
    },
    onError: onActionError,
  });

  const form = useForm<SignUpInputType>({
    defaultValues,
    resolver: zodResolver(signUpInputSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: SignUpInputType) => {
    execute(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-primary">
          Đăng ký tài khoản
        </h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LucideUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                      <Input
                        {...field}
                        type="text"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                      <Input
                        {...field}
                        type="tel"
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

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LucideShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
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
              Đăng ký
              {isPending && <AnimateLoadingIcon />}
            </Button>
          </form>
        </Form>

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

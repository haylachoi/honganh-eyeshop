"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { onActionError } from "@/lib/actions/action.helper";
import { adminUserInputSchema } from "@/features/users/user.validator";
import { createAdminAccountAction } from "@/features/users/user.actions";
import FormTextInput from "@/components/shared/form/form-text-input";
import { z } from "zod";
import { LucideEye, LucideEyeOff, LucideLock } from "lucide-react";
import SubmitButton from "@/components/custom-ui/submit-button";
import { useState } from "react";
import FormSelectInput from "@/components/shared/form/form-select-input";
import { ADMIN_ROLES } from "@/features/authorization/authorization.constants";

type AdminAccountInputType = z.infer<typeof adminUserInputSchema>;
const defaultValues: AdminAccountInputType = {
  name: "test",
  email: "lala@gmail.com",
  phone: "129823498",
  role: "seller",
  password: "123",
  confirmPassword: "123",
};

export const AccountFormCreate = () => {
  const form = useForm<AdminAccountInputType>({
    resolver: zodResolver(adminUserInputSchema),
    defaultValues,
  });
  const { execute, isPending } = useAction(createAdminAccountAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CREATE.SUCCESS);
    },
    onError: onActionError,
  });
  const { control } = form;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: AdminAccountInputType) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Name */}
        <FormTextInput
          name="name"
          control={control}
          label="Tên tài khoản"
          placeholder="Nhập tên tài khoản"
        />

        {/* Email */}
        <FormTextInput
          name="email"
          control={control}
          label="Email"
          placeholder="Nhập email"
        />

        <FormTextInput
          name="phone"
          control={control}
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
        />

        {/* Role */}
        <FormSelectInput
          name="role"
          control={control}
          label="Vai trò"
          placeholder="Nhập vai trò"
          list={ADMIN_ROLES}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <div className="relative">
                <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    className="pl-10 pr-10"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <LucideEyeOff className="size-5" />
                  ) : (
                    <LucideEye className="size-5" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Xác nhận mật khẩu */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <div className="relative">
                <LucideLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <FormControl>
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    className="pl-10 pr-10"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <LucideEye className="size-5" />
                  ) : (
                    <LucideEyeOff className="size-5" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton label="Tạo" isLoading={isPending} className="w-full" />
      </form>
    </Form>
  );
};

"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { onActionError } from "@/lib/actions/action.helper";
import { Id } from "@/types";
import { changeCustomerPasswordAction } from "@/features/users/user.actions";
import { PasswordChangeType } from "@/features/users/user.types";
import { passwordChangeSchema } from "@/features/users/user.validator";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordChangeForm = ({ id }: { id: Id }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const form = useForm<PasswordChangeType>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      id,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { execute, isPending } = useAction(changeCustomerPasswordAction, {
    onSuccess({ data }) {
      if (!data) {
        toast.error("Cóó lỗi xảy ra");
        return;
      }

      if (data.success) {
        toast.success("Đổi mật khẩu thành công");
        form.reset();
      } else {
        toast.error(data?.message ?? "Thất bại");
      }
    },
    onError: onActionError,
  });

  const onSubmit = (data: PasswordChangeType) => {
    execute(data);
  };

  const renderPasswordField = (
    name: keyof PasswordChangeType,
    label: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...field}
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderPasswordField("currentPassword", "Mật khẩu hiện tại")}
          {renderPasswordField("newPassword", "Mật khẩu mới")}
          {renderPasswordField("confirmNewPassword", "Xác nhận mật khẩu mới")}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <AnimateLoadingIcon />}
            Đổi mật khẩu
          </Button>
        </form>
      </Form>
    </div>
  );
};

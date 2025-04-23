"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { onActionError } from "@/lib/actions/action.helper";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { CustomerInfoUpdateType } from "@/features/users/user.types";
import { customerInfoUpdateSchema } from "@/features/users/user.validator";
import { updateCustomerInfoAction } from "@/features/users/user.actions";

export const UserInfoForm = ({
  initValues,
}: {
  initValues: CustomerInfoUpdateType;
}) => {
  const form = useForm<CustomerInfoUpdateType>({
    resolver: zodResolver(customerInfoUpdateSchema),
    defaultValues: {
      id: initValues.id,
      name: initValues.name,
      phone: initValues.phone,
    },
  });

  const { execute, isPending } = useAction(updateCustomerInfoAction, {
    onSuccess: ({ data }) => {
      const result = data;
      if (result?.success) {
        toast.success("Cập nhật thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    },
    onError: onActionError,
  });

  const onSubmit = async (data: CustomerInfoUpdateType) => {
    execute(data);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Họ và tên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Số điện thoại */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <AnimateLoadingIcon />}
            Cập nhật
          </Button>
        </form>
      </Form>
    </div>
  );
};

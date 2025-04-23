"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useAction } from "next-safe-action/hooks";
import { onActionError } from "@/lib/actions/action.helper";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { updateCustomerShippingAddressAction } from "@/features/users/user.actions";
import { ShippingAddressUpdateType } from "@/features/users/user.types";
import { shippingAddressUpdateSchema } from "@/features/users/user.validator";

export default function ShippingAddressForm({
  initValues,
}: {
  initValues: ShippingAddressUpdateType;
}) {
  const form = useForm<ShippingAddressUpdateType>({
    resolver: zodResolver(shippingAddressUpdateSchema),
    defaultValues: initValues,
  });

  const { execute, isPending } = useAction(
    updateCustomerShippingAddressAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) toast.success("Địa chỉ đã được cập nhật");
        else toast.error("Cập nhật địa chỉ thất bại");
      },
      onError: onActionError,
    },
  );

  const onSubmit = (data: ShippingAddressUpdateType) => {
    execute(data);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Địa chỉ giao hàng</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phường/Xã</FormLabel>
                <FormControl>
                  <Input placeholder="Phường/Xã" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quận/Huyện</FormLabel>
                <FormControl>
                  <Input placeholder="Quận/Huyện" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <FormControl>
                  <Input placeholder="Tỉnh/Thành phố" {...field} />
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
}

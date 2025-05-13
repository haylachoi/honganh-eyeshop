"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { settingsTypeSchema } from "@/features/settings/settings.validator";
import { z } from "zod";
import { toast } from "sonner";
import { onActionError } from "@/lib/actions/action.helper";
import { createOrUpdateSellersSettingsAction } from "@/features/settings/settings.actions";
import { useAction } from "next-safe-action/hooks";
import SubmitButton from "@/components/custom-ui/submit-button";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "lucide-react";

const updateSchema = settingsTypeSchema.pick({
  sellers: true,
});
type SellersFormType = z.infer<typeof updateSchema>;

export const SellerFormUpdate = ({
  defaultValues,
}: {
  defaultValues: SellersFormType;
}) => {
  const form = useForm<SellersFormType>({
    resolver: zodResolver(updateSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sellers",
  });

  const { execute, isPending } = useAction(
    createOrUpdateSellersSettingsAction,
    {
      onSuccess: () => {
        toast.success("Cập nhật thành công");
      },
      onError: onActionError,
    },
  );

  const onSubmit = (data: SellersFormType) => {
    execute(data.sellers);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 relative">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-lg">Nhân viên {index + 1}</div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`sellers.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`sellers.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`sellers.${index}.phone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`sellers.${index}.facebook`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {index < fields.length - 1 && <Separator className="my-6" />}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ name: "", email: "", phone: "", facebook: "" })
          }
        >
          Thêm người bán
        </Button>

        <SubmitButton label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};

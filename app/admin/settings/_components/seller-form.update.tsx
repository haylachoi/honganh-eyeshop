"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { sellersSettingsUpdateSchema } from "@/features/settings/settings.validator";
import { toast } from "sonner";
import { onActionError } from "@/lib/actions/action.helper";
import { createOrUpdateSellersSettingsAction } from "@/features/settings/settings.actions";
import { useAction } from "next-safe-action/hooks";
import SubmitButton from "@/components/custom-ui/submit-button";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "lucide-react";
import FormCheckbox from "@/components/shared/form/form-check-box";
import FormTextInput from "@/components/shared/form/form-text-input";
import { useEffect } from "react";
import { updateSearchParam } from "@/lib/utils";
import { SellersSettingsUpdateType } from "@/features/settings/settings.types";
import { UploadIcon } from "./upload-icon";
import { SettingCard } from "./setting-card";

const updateSchema = sellersSettingsUpdateSchema;

type SellersFormType = SellersSettingsUpdateType;

const iconKeys = ["icon1", "icon2", "icon3"] as const;
export const SellerFormUpdate = ({
  defaultValues,
}: {
  defaultValues: SellersFormType;
}) => {
  const form = useForm<SellersFormType>({
    resolver: zodResolver(updateSchema),
    defaultValues,
  });

  const { watch } = form;

  const socialMedia1 = watch("socialIcons.icon1.name");
  const socialMedia2 = watch("socialIcons.icon2.name");
  const socialMedia3 = watch("socialIcons.icon3.name");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "list",
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

  useEffect(() => {
    updateSearchParam("tab", "sellers");
  }, []);

  const onSubmit = (data: SellersFormType) => {
    execute(data);
  };

  const textInputInfo = [
    { name: "name", label: "Tên" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Số điện thoại" },
    { name: "socialMedia1", label: socialMedia1 },
    { name: "socialMedia2", label: socialMedia2 },
    { name: "socialMedia3", label: socialMedia3 },
  ] as const;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingCard
          title="Thôn tin liên lạc"
          description="Thông tin về thông tin liên lạc qua mạng xã."
        >
          <ul className="grid grid-cols-3 gap-2">
            {iconKeys.map((key, index) => (
              <li key={key} className="flex flex-col gap-4">
                <FormTextInput
                  control={form.control}
                  name={`socialIcons.${key}.name`}
                  label={`Tên Social media ${index + 1}`}
                />
                <UploadIcon
                  name={`socialIcons.${key}.url`}
                  control={form.control}
                  defaultValue={defaultValues?.socialIcons?.[key]?.url}
                />
              </li>
            ))}
          </ul>
        </SettingCard>

        <SettingCard
          title="Nhân viên"
          description="Thông tin về nhân viên bán hàng."
        >
          <div className="space-y-8">
            <ul className="space-y-4">
              {fields.map((field, index) => (
                <li key={field.id} className="space-y-4 relative">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-lg">
                      Nhân viên {index + 1}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>

                  {textInputInfo.map(({ name, label }) => (
                    <FormTextInput
                      key={name}
                      control={form.control}
                      name={`list.${index}.${name}`}
                      label={label}
                    />
                  ))}

                  <FormCheckbox
                    label="Kích hoạt"
                    control={form.control}
                    name={`list.${index}.isActive`}
                  />

                  {index < fields.length - 1 && <Separator className="my-6" />}
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  email: "",
                  phone: "",
                  socialMedia1: "",
                  socialMedia2: "",
                  socialMedia3: "",
                  isActive: true,
                })
              }
            >
              Thêm người bán
            </Button>
          </div>
        </SettingCard>

        <SubmitButton label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};

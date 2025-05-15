"use client";

import SubmitButton from "@/components/custom-ui/submit-button";
import FormSelectInput from "@/components/shared/form/form-select-input";
import FormTextInput from "@/components/shared/form/form-text-input";
import { Form } from "@/components/ui/form";
import { createOrUpdateSiteSettingsAction } from "@/features/settings/settings.actions";
import { SOCIAL_TYPES_LIST } from "@/features/settings/settings.constants";
import {
  SiteSettingsType,
  SiteSettingsUpdateType,
} from "@/features/settings/settings.types";
import { siteSettingsUpdateSchema } from "@/features/settings/settings.validator";
import { onActionError } from "@/lib/actions/action.helper";
import { updateSearchParam } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadFileIcon } from "./upload-icon";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { SettingCard } from "./setting-card";

export const SiteFormUpdate = ({
  defaultValues,
}: {
  defaultValues: SiteSettingsType;
}) => {
  const form = useForm<SiteSettingsUpdateType>({
    resolver: zodResolver(siteSettingsUpdateSchema),
    defaultValues,
  });

  const { execute, isPending } = useAction(createOrUpdateSiteSettingsAction, {
    onSuccess: () => {
      toast.success("Cập nhật thành công");
    },
    onError: onActionError,
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const onSubmit = async (data: SiteSettingsUpdateType) => {
    execute(data);
  };

  useEffect(() => {
    updateSearchParam("tab", "general");
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SettingCard
          title="Chung"
          description="Thông tin chung về trang web của bạn."
        >
          <div className="flex flex-col gap-4">
            <FormTextInput
              control={control}
              name="name"
              label="Tên trang web"
            />
            <FormTextInput control={control} name="slogan" label="Slogan" />

            <FormTextInput
              control={control}
              name="description"
              label="Mô tả "
            />
            <FormTextInput control={control} name="email" label="Email" />
            <FormTextInput
              control={control}
              name="phone"
              label="Số điện thoại"
            />
            <FormTextInput control={control} name="address" label="Địa chỉ" />
            <FormTextInput
              control={control}
              name="businessRegistrationNumber"
              label="MSDN"
            />
            <FormTextInput
              control={control}
              name="legalRepresentative"
              label="Người đại diện"
            />

            <UploadFileIcon
              control={control}
              name="logo"
              defaultValue={defaultValues.logo}
            />
          </div>
        </SettingCard>

        <SettingCard
          title="Mạng xã hội"
          description="Thông tin về mạng xã hội."
        >
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-medium text-muted-foreground">
                    Mạng xã hội {index + 1}
                  </div>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Các trường */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <FormTextInput
                    control={control}
                    name={`socialLinks.${index}.name`}
                    label="Tên"
                  />
                  <FormTextInput
                    control={control}
                    name={`socialLinks.${index}.url`}
                    label="URL"
                  />
                  <FormSelectInput
                    control={control}
                    name={`socialLinks.${index}.type`}
                    list={SOCIAL_TYPES_LIST}
                    label="Loại"
                  />
                  <UploadFileIcon
                    control={control}
                    name={`socialLinks.${index}.icon`}
                    defaultValue={
                      typeof field.icon === "string" ? field.icon : ""
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  url: "",
                  type: SOCIAL_TYPES_LIST[0],
                  icon: "",
                })
              }
              className="text-primary underline text-sm cursor-pointer"
            >
              + Thêm liên kết
            </button>
          </div>
        </SettingCard>

        <SubmitButton className="w-max" label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};

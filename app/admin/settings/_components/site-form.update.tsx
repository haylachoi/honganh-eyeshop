"use client";

import SubmitButton from "@/components/custom-ui/submit-button";
import FormTextInput from "@/components/shared/form/form-text-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createOrUpdateSiteSettingsAction } from "@/features/settings/settings.actions";
import { SiteSettingsUpdateType } from "@/features/settings/settings.types";
import { siteSettingsUpdateSchema } from "@/features/settings/settings.validator";
import { onActionError } from "@/lib/actions/action.helper";
import { updateSearchParam } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SiteFormUpdate = ({
  defaultValues,
}: {
  defaultValues: SiteSettingsUpdateType;
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

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    typeof defaultValues.logo === "string" ? defaultValues.logo : null,
  );

  const onSubmit = async (data: SiteSettingsUpdateType) => {
    execute(data);
  };

  useEffect(() => {
    return () => {
      if (logoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  useEffect(() => {
    updateSearchParam("tab", "general");
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTextInput control={control} name="name" label="Tên trang web" />
        <FormTextInput control={control} name="slogan" label="Slogan" />

        <FormTextInput control={control} name="description" label="Mô tả " />
        <FormTextInput control={control} name="email" label="Email" />
        <FormTextInput control={control} name="phone" label="Số điện thoại" />
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

        <div className="flex flex-row-reverse justify-end gap-4 border border-input rounded-md p-4">
          {logoPreviewUrl && (
            <Image
              src={logoPreviewUrl}
              alt="Logo preview"
              width={64}
              height={64}
              className="object-contain"
            />
          )}

          <FormField
            control={control}
            name="logo"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel className="font-normal cursor-pointer">
                  <UploadIcon />
                  Upload Logo
                </FormLabel>
                <FormControl>
                  <Input
                    className="hidden"
                    type="file"
                    accept=".svg"
                    {...rest}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const objectUrl = URL.createObjectURL(file);
                      setLogoPreviewUrl(objectUrl);

                      // Tùy server: có thể cần gửi `file`, hoặc `file.text()` để lấy string
                      file.text().then((text) => {
                        onChange(text);
                      });
                      e.target.value = "";
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton className="w-max" label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};

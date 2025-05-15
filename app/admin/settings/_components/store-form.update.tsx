"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/custom-ui/submit-button";
import { TrashIcon } from "lucide-react";

import { toast } from "sonner";
import { updateSearchParam } from "@/lib/utils";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";

import { settingsTypeSchema } from "@/features/settings/settings.validator";
import { createOrUpdateStoresSettingsAction } from "@/features/settings/settings.actions";
import { STORE_TYPES_LIST } from "@/features/settings/settings.constants";

import FormTextInput from "@/components/shared/form/form-text-input";
import FormSelectInput from "@/components/shared/form/form-select-input";
import FormCheckbox from "@/components/shared/form/form-check-box";
import { SettingCard } from "./setting-card";

const updateSchema = settingsTypeSchema.pick({ stores: true });
type StoresFormType = z.infer<typeof updateSchema>;

// Field configs
const storeFields = [
  { name: "name", label: "Tên cửa hàng" },
  { name: "description", label: "Mô tả" },
] as const;

const addressFields = [
  { name: "address", label: "Địa chỉ" },
  { name: "district", label: "Quận/Thành phố" },
  { name: "province", label: "Tỉnh/Thành phố" },
  { name: "postalCode", label: "Mã bưu chính" },
] as const;

const contactFields = [
  { name: "phone", label: "Số điện thoại" },
  { name: "email", label: "Email" },
  { name: "facebook", label: "Facebook" },
] as const;

const locationFields = [
  { name: "latitude", label: "Latitude" },
  { name: "longitude", label: "Longitude" },
  { name: "googleMapLink", label: "Google Map URL" },
] as const;

export const StoreFormUpdate = ({
  defaultValues,
}: {
  defaultValues: StoresFormType;
}) => {
  const form = useForm<StoresFormType>({
    resolver: zodResolver(updateSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stores",
  });

  const { execute, isPending } = useAction(createOrUpdateStoresSettingsAction, {
    onSuccess: () => toast.success("Cập nhật thành công"),
    onError: onActionError,
  });

  useEffect(() => {
    updateSearchParam("tab", "stores");
  }, []);

  const onSubmit = (data: StoresFormType) => {
    execute(data.stores);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ul className="flex flex-col gap-8">
          {fields.map((field, index) => (
            <li key={field.id}>
              <SettingCard
                title={
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Cửa hàng {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  {storeFields.map(({ name, label }) => (
                    <FormTextInput
                      key={name}
                      control={form.control}
                      name={`stores.${index}.${name}`}
                      label={label}
                    />
                  ))}

                  <FormSelectInput
                    control={form.control}
                    name={`stores.${index}.type`}
                    label="Loại cửa hàng"
                    list={STORE_TYPES_LIST}
                  />

                  {addressFields.map(({ name, label }) => (
                    <FormTextInput
                      key={name}
                      control={form.control}
                      name={`stores.${index}.addressInfo.${name}`}
                      label={label}
                    />
                  ))}

                  {contactFields.map(({ name, label }) => (
                    <FormTextInput
                      key={name}
                      control={form.control}
                      name={`stores.${index}.contactInfo.${name}`}
                      label={label}
                    />
                  ))}

                  {locationFields.map(({ name, label }) => (
                    <FormTextInput
                      key={name}
                      control={form.control}
                      name={`stores.${index}.location.${name}`}
                      label={label}
                    />
                  ))}

                  <FormTextInput
                    control={form.control}
                    name={`stores.${index}.openingHours`}
                    label="Giờ hoạt động"
                    placeholder="Ví dụ: 8:00 - 17:00"
                  />

                  <FormCheckbox
                    control={form.control}
                    name={`stores.${index}.isOpenNow`}
                    label="Đang mở cửa"
                  />
                </div>
              </SettingCard>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              description: "",
              addressInfo: {
                address: "",
                district: "",
                province: "",
                postalCode: "",
              },
              location: {
                latitude: 0,
                longitude: 0,
                googleMapLink: "",
              },
              contactInfo: {
                phone: "",
                email: "",
                facebook: "",
                zalo: "",
              },
              openingHours: "",
              type: STORE_TYPES_LIST[0],
              isOpenNow: true,
            })
          }
        >
          Thêm cửa hàng
        </Button>

        <SubmitButton label="Lưu" isLoading={isPending} />
      </form>
    </Form>
  );
};

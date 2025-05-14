"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/custom-ui/submit-button";
import { TrashIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { settingsTypeSchema } from "@/features/settings/settings.validator";
import { z } from "zod";
import { toast } from "sonner";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import { createOrUpdateStoresSettingsAction } from "@/features/settings/settings.actions";
import FormCheckbox from "@/components/shared/form/form-check-box";
import { STORE_TYPES_LIST } from "@/features/settings/settings.constants";
import FormTextInput from "@/components/shared/form/form-text-input";
import FormSelectInput from "@/components/shared/form/form-select-input";
import { useEffect } from "react";
import { updateSearchParam } from "@/lib/utils";

const updateSchema = settingsTypeSchema.pick({ stores: true });
type StoresFormType = z.infer<typeof updateSchema>;

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
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 relative">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-lg">Cửa hàng {index + 1}</div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>

            <FormTextInput
              control={form.control}
              name={`stores.${index}.name`}
              label="Tên cửa hàng"
            />

            <FormTextInput
              control={form.control}
              name={`stores.${index}.description`}
              label="Mô tả"
            />

            <FormSelectInput
              control={form.control}
              name={`stores.${index}.type`}
              label="Loại cửa hàng"
              list={STORE_TYPES_LIST}
            />

            <FormTextInput
              control={form.control}
              name={`stores.${index}.addressInfo.address`}
              label="Địa chỉ"
            />
            <FormTextInput
              control={form.control}
              name={`stores.${index}.addressInfo.district`}
              label="Quận/Thành phố"
            />
            <FormTextInput
              control={form.control}
              name={`stores.${index}.addressInfo.province`}
              label="Tỉnh/Thành phố"
            />
            <FormTextInput
              control={form.control}
              name={`stores.${index}.addressInfo.postalCode`}
              label="Mã bưu chính"
            />

            <FormTextInput
              control={form.control}
              name={`stores.${index}.contactInfo.phone`}
              label="Số điện thoại"
            />
            <FormTextInput
              control={form.control}
              name={`stores.${index}.contactInfo.email`}
              label="Email"
            />

            <FormTextInput
              control={form.control}
              name={`stores.${index}.contactInfo.facebook`}
              label="Facebook"
            />

            {/* Location */}
            <FormTextInput
              control={form.control}
              name={`stores.${index}.location.latitude`}
              label="Latitude"
            />
            <FormTextInput
              control={form.control}
              name={`stores.${index}.location.longitude`}
              label="Longitude"
            />
            <FormTextInput
              control={form.control}
              name={`stores.${index}.location.googleMapLink`}
              label="Google Map URL"
            />

            {/* Giờ hoạt động */}
            <FormTextInput
              control={form.control}
              name={`stores.${index}.openingHours`}
              label="Giờ hoạt động"
              placeholder="Ví dụ: 8:00 - 17:00"
            />

            <FormCheckbox
              label="Đang mở cửa"
              control={form.control}
              name={`stores.${index}.isOpenNow`}
            />

            {index < fields.length - 1 && <Separator className="my-6" />}
          </div>
        ))}

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
              location: { latitude: 0, longitude: 0, googleMapLink: "" },
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

"use client";

import SubmitButton from "@/components/custom-ui/submit-button";
import FormRadioGroup from "@/components/shared/form/form-radio-group";
import FormSelectInput from "@/components/shared/form/form-select-input";
import FormTextInput from "@/components/shared/form/form-text-input";
import { Form } from "@/components/ui/form";
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { updateCouponAction } from "@/features/coupons/coupon.actions";
import {
  COUPON_STATUS,
  couponUpdateSchemaWithoutTransform,
} from "@/features/coupons/coupon.validator";
import { onActionError } from "@/lib/actions/action.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type InputType = z.input<typeof couponUpdateSchemaWithoutTransform>;

export const CouponUpdateForm = ({
  defaultValues,
}: {
  defaultValues: InputType;
}) => {
  const router = useRouter();
  const { execute, isPending } = useAction(updateCouponAction, {
    onSuccess: () => {
      router.push(`${ADMIN_ENDPOINTS.COUPONS}`);
      toast.success(TOAST_MESSAGES.UPDATE.SUCCESS);
    },
    onError: onActionError,
  });
  const form = useForm<InputType>({
    resolver: zodResolver(couponUpdateSchemaWithoutTransform),
    defaultValues,
  });
  const onSubmit = (data: InputType) => {
    execute(data);
  };

  const { control, watch, setValue } = form;
  const startDate = watch("startDate");
  const maxDiscount = watch("maxDiscount");
  const type = watch("type");

  React.useEffect(() => {
    if (type === "fixed" && maxDiscount !== 0) {
      setValue("maxDiscount", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, maxDiscount]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormTextInput control={control} name="code" label="Mã giảm giá" />
        <FormRadioGroup
          control={control}
          name="type"
          label="Loại giảm giá"
          defaultValue={defaultValues.type}
          data={[
            { value: "percent", label: "Phần trăm" },
            { value: "fixed", label: "Giảm trực tiếp" },
          ]}
        />
        <FormTextInput
          inputMode="numeric"
          control={control}
          name="value"
          placeholder={type === "percent" ? "Đơn vị %" : "Đơn vị VND"}
          label="Giảm giá"
        />
        <FormTextInput control={control} name="description" label="Mô tả" />
        <FormTextInput
          inputMode="numeric"
          control={control}
          name="minOrderValue"
          label="Giá trị đơn hàng tối thiểu"
        />
        {type === "percent" && (
          <FormTextInput
            inputMode="numeric"
            control={control}
            name="maxDiscount"
            label="Giảm giá tối đa"
          />
        )}
        <FormTextInput
          inputMode="numeric"
          control={control}
          name="usageLimit"
          label="Số lượng sử dụng tối đa"
        />
        <FormTextInput
          control={control}
          type="datetime-local"
          name="startDate"
          label="Ngày bắt đầu"
        />
        <FormTextInput
          control={control}
          type="datetime-local"
          name="expiryDate"
          label="Ngày hết hạn"
          min={startDate}
        />
        <FormSelectInput
          control={control}
          name="status"
          label="Trạng thái"
          list={COUPON_STATUS}
        />
        <SubmitButton
          label="Cập nhật"
          isLoading={isPending}
          disabled={isPending}
        />
      </form>
    </Form>
  );
};

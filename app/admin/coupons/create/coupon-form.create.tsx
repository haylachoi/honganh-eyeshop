"use client";

import SubmitButton from "@/components/custom-ui/submit-button";
import FormRadioGroup from "@/components/shared/form/form-radio-group";
import FormSelectInput from "@/components/shared/form/form-select-input";
import FormTextInput from "@/components/shared/form/form-text-input";
import { Form } from "@/components/ui/form";
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { createCouponAction } from "@/features/coupons/coupon.actions";
import {
  COUPON_STATUS,
  couponInputWithoutTransform,
} from "@/features/coupons/coupon.validator";
import { onActionError } from "@/lib/actions/action.helper";
import { formatDateTimeLocal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type InputType = z.input<typeof couponInputWithoutTransform>;

const defaultValues: InputType = {
  code: "",
  value: 10,
  description: "",
  discountType: "percent",
  minOrderValue: 500_000,
  maxDiscount: 20_000,
  usageLimit: 50,
  usedCount: 0,
  startDate: formatDateTimeLocal(new Date()),
  expiryDate: formatDateTimeLocal(new Date()),
  status: "active",
};
export const CouponCreateForm = () => {
  const router = useRouter();
  const { execute, isPending } = useAction(createCouponAction, {
    onSuccess: () => {
      router.push(ADMIN_ENDPOINTS.COUPONS);
      toast.success(TOAST_MESSAGES.CREATE.SUCCESS);
    },
    onError: onActionError,
  });
  const form = useForm<InputType>({
    resolver: zodResolver(couponInputWithoutTransform),
    defaultValues,
  });
  const onSubmit = (data: InputType) => {
    execute(data);
  };
  const { control, watch, setValue } = form;
  const startDate = watch("startDate");
  const maxDiscount = watch("maxDiscount");
  const type = watch("discountType");

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
          name="discountType"
          label="Loại giảm giá"
          defaultValue={defaultValues.discountType}
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
        <FormTextInput
          inputMode="numeric"
          control={control}
          name="value"
          placeholder="Đơn vị %"
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
        <SubmitButton label="Tạo" isLoading={isPending} disabled={isPending} />
      </form>
    </Form>
  );
};

"use client";

import SubmitButton from "@/components/custom-ui/submit-button";
import { VNPAY_ENABLE } from "@/constants";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { updateCartAfterOrder } from "@/features/cart/cart.utils";
import { updateCheckoutAction } from "@/features/checkouts/checkout.actions";
import {
  CheckoutType,
  ValidatedItemInfo,
} from "@/features/checkouts/checkout.types";
import { checkValidCouponCodeAction } from "@/features/coupons/coupon.actions";
import { calculateDiscount } from "@/features/coupons/coupon.utils";
import { createOrderAction } from "@/features/orders/order.actions";
import { orderInputSchema } from "@/features/orders/order.validator";
import { SafeUserInfo } from "@/features/users/user.types";
import { useCheckoutStore } from "@/hooks/use-checkout";
import { cn, currencyFormatter } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { ZodError } from "zod";

const formatZodError = (error: ZodError): Record<string, string> => {
  return error.errors.reduce<Record<string, string>>((acc, err) => {
    if (err.path.length > 0) {
      acc[err.path.join(".")] = err.message;
    } else {
      acc["_global"] = err.message;
    }
    return acc;
  }, {});
};

const getFormFields = ({
  checkout,
  defaultUserInfo,
}: {
  checkout: CheckoutType;
  defaultUserInfo: Pick<
    SafeUserInfo,
    "name" | "phone" | "email" | "shippingAddress"
  >;
}) => [
  {
    label: "Tên khách hàng",
    name: "customer.name",
    type: "text",
    value: checkout?.customer?.name || defaultUserInfo.name,
  },
  {
    label: "Email",
    name: "customer.email",
    type: "text",
    value: checkout?.customer?.email || defaultUserInfo.email,
  },
  {
    label: "Số điện thoại",
    name: "customer.phone",
    type: "tel",
    value: checkout?.customer?.phone || defaultUserInfo.phone,
  },
  {
    label: "Địa chỉ",
    name: "shippingAddress.address",
    type: "text",
    value:
      checkout?.shippingAddress?.address ||
      defaultUserInfo.shippingAddress?.address ||
      "",
  },
  {
    label: "Phường/xã",
    name: "shippingAddress.ward",
    type: "text",
    value:
      checkout?.shippingAddress?.ward ||
      defaultUserInfo.shippingAddress?.ward ||
      "",
  },
  {
    label: "Quận/huyện",
    name: "shippingAddress.district",
    type: "text",
    value:
      checkout?.shippingAddress?.district ||
      defaultUserInfo.shippingAddress?.district ||
      "",
  },
  {
    label: "Thành phố/tỉnh",
    name: "shippingAddress.city",
    type: "text",
    value:
      checkout?.shippingAddress?.city ||
      defaultUserInfo.shippingAddress?.city ||
      "",
  },
];

const CheckoutForm = ({
  checkout,
  className,
  defaultUserInfo,
}: {
  checkout: CheckoutType;
  className?: string;
  defaultUserInfo: Pick<
    SafeUserInfo,
    "name" | "phone" | "email" | "shippingAddress"
  >;
}) => {
  const coupon = useCheckoutStore((state) => state.coupon);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [productErrors, setProductErrors] = React.useState<
    ValidatedItemInfo[] | undefined
  >(undefined);
  const router = useRouter();

  const { execute, isPending } = useAction(createOrderAction, {
    onSuccess: (result) => {
      if (!checkout.userId) {
        updateCartAfterOrder(checkout.items);
      }

      toast.success(TOAST_MESSAGES.ORDER.CREATE.SUCCESS);
      if (result.data) {
        const { success, paymentUrl } = result.data;
        if (success && paymentUrl) {
          router.push(paymentUrl);
        }
      }
    },
    onError: (e) => {
      const serverError = e.error?.serverError;
      if (serverError) {
        toast.error(serverError.message);
      }

      if (serverError?.type === "ValidationError") {
        const errors = serverError.detail as ValidatedItemInfo[];

        if (errors) {
          setProductErrors(errors);
        }
      }
    },
  });

  const discount = calculateDiscount({
    total: checkout.total,
    coupon,
  });
  const total = Math.max(checkout.total - discount, 0);

  const onSubmit = (formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries());
    const data = Object.keys(rawData).reduce(
      (acc, key) => {
        const keys = key.split(".");
        keys.reduce((nestedObj, k, index) => {
          if (index === keys.length - 1) {
            nestedObj[k] = rawData[key];
          } else {
            nestedObj[k] = nestedObj[k] || {};
          }
          return nestedObj[k];
        }, acc);
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>,
    );

    const input = {
      ...data,
      checkoutid: checkout.id,
      couponCode: coupon?.code,
    };
    const inputResult = orderInputSchema.safeParse(input);
    if (!inputResult.success) {
      setErrors(formatZodError(inputResult.error));
      return;
    }

    execute(inputResult.data);
  };

  return (
    <div
      className={cn(
        "grid lg:grid-cols-2 gap-x-8 gap-y-4 max-lg:flex flex-col-reverse",
        className,
      )}
    >
      <div className="">
        <form action={onSubmit} className="flex flex-col gap-4">
          {getFormFields({ checkout, defaultUserInfo }).map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              checkoutId={checkout.id}
              value={field.value}
              errors={errors}
            />
          ))}

          <div>
            <p>Phương thức thanh toán</p>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  defaultChecked={checkout.paymentMethod === "cod"}
                />
                <span>COD</span>
              </label>
              {VNPAY_ENABLE && (
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    defaultChecked={checkout.paymentMethod === "vnpay"}
                  />
                  <span>VNPAY</span>
                </label>
              )}
            </div>
          </div>
          <SubmitButton label="Đặt hàng" isLoading={isPending} />
        </form>
      </div>
      <div className="max-lg:bg-secondary max-lg:py-4 max-lg:shadow-[0_0_0_20rem_var(--secondary)] clip-x">
        <ul className="space-y-4">
          {checkout?.items.map((item) => (
            <li key={`${item.productId}-${item.variantId}`}>
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <div className="relative">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.productName}-${item.variantId}`}
                    width={100}
                    height={50}
                  />
                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-6 rounded-full bg-foreground/50 text-background grid place-items-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="">{item.productName}</span>
                    <span className="text-xs text-foreground/70">
                      {item.attributes.map((attr) => (
                        <span key={attr.name}>
                          {attr.name}: {attr.value}
                        </span>
                      ))}
                    </span>
                  </div>
                  <span className="">
                    {currencyFormatter.format(item.price * item.quantity)}
                  </span>
                </div>
              </div>
              <span className="text-destructive text-sm">
                {
                  productErrors?.find(
                    (err) =>
                      err.product.productId === item.productId &&
                      err.product.variantId === item.variantId,
                  )?.message
                }
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{currencyFormatter.format(checkout.total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Giảm giá</span>
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "hidden text-foreground/80",
                coupon?.discountType === "percent" && "block",
              )}
            >
              {`(-${coupon?.value}%)`}
            </span>
            <span>{currencyFormatter.format(-discount)}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Thanh toán</span>
          <span>{currencyFormatter.format(total)}</span>
        </div>
        <CouponForm checkout={checkout} />
      </div>
    </div>
  );
};

export default CheckoutForm;

const FormInput = ({
  label,
  name,
  type,
  checkoutId,
  value: initialValue,
  optional: isOptional = true,
  errors,
  ...props
}: React.ComponentProps<"input"> & {
  name: string;
  value: string | undefined;
  label: string;
  checkoutId: string;
  optional?: boolean;
  errors: Record<string, string>;
}) => {
  const [value, setValue] = React.useState<string>(initialValue ?? "");
  const [debouncedValue] = useDebounce(value, 1000);

  React.useEffect(() => {
    updateCheckoutAction({
      id: checkoutId,
      name,
      value: debouncedValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="gap-2">
      <label className="grid grid-rows-[auto_1fr]">
        <div className="flex items-center gap-1">
          {label}
          {isOptional && <span className="text-destructive text-sm">*</span>}
        </div>
        <input
          className="border border-input px-2 py-1"
          type={type}
          name={name}
          value={value}
          required={!isOptional}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
      </label>
      <span className="text-destructive text-sm">{errors[name]}</span>
    </div>
  );
};

const CouponForm = ({ checkout }: { checkout: CheckoutType }) => {
  const [code, setCode] = React.useState<string>("");
  const setCoupon = useCheckoutStore((state) => state.setCoupon);
  const { execute, result, isPending } = useAction(checkValidCouponCodeAction, {
    onSuccess: (result) => {
      if (result.data?.valid) {
        setCoupon(result.data.couponInfo);
      }
    },
    onError: () => {
      setCoupon(undefined);
    },
  });

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-2 ">
      <div>
        <input
          className="border border-foreground size-full"
          name="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <SubmitButton
        type="button"
        label="Áp dụng"
        isLoading={isPending}
        disabled={!code}
        onClick={() => execute({ code, checkoutId: checkout.id })}
      />
      <span
        className={cn(
          "text-destructive",
          result?.data?.valid && "text-success",
        )}
      >
        {result?.data?.message}
      </span>
    </div>
  );
};

"use client";

import SubmitButton from "@/components/custom-ui/submit-button";
import { updateCheckoutAction } from "@/features/checkouts/checkout.actions";
import { CheckoutType } from "@/features/checkouts/checkout.types";
import { checkValidCouponCodeAction } from "@/features/coupons/coupon.actions";
import { calculateDiscount } from "@/features/coupons/coupon.utils";
import { createOrderAction } from "@/features/orders/order.actions";
import { orderInputSchema } from "@/features/orders/order.validator";
import { useCheckoutStore } from "@/hooks/use-checkout";
import { onActionError } from "@/lib/actions/action.helper";
import { cn, currencyFormatter } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const CheckoutView = ({ checkout }: { checkout: CheckoutType }) => {
  const coupon = useCheckoutStore((state) => state.coupon);
  const { execute, isPending } = useAction(createOrderAction, {
    onSuccess: (result) => {
      console.log(result);
    },
    onError: onActionError,
  });

  const discount = calculateDiscount({
    total: checkout.total,
    coupon,
  });
  const total = Math.max(checkout.total - discount, 0);

  return (
    <div className="grid lg:grid-cols-2 border border-input">
      <div className="bg-background p-4">
        <form
          action={(formData) => {
            const rawData = Object.fromEntries(formData.entries());
            const data = Object.keys(rawData).reduce(
              (acc, key) => {
                const keys = key.split(".");
                keys.reduce((nestedObj, k, index) => {
                  if (index === keys.length - 1) {
                    nestedObj[k] = rawData[key]; // Gán giá trị cuối
                  } else {
                    nestedObj[k] = nestedObj[k] || {}; // Tạo object nếu chưa tồn tại
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
              couponCode: coupon?.code,
              items: checkout.items,
              paymentMethod: checkout.paymentMethod,
            };
            const inputResult = orderInputSchema.safeParse(input);
            if (!inputResult.success) {
              toast.error(inputResult.error.message);
              return;
            }

            execute(inputResult.data);
          }}
        >
          <FormInput
            label="Tên khách hàng"
            name="customer.name"
            type="text"
            checkoutId={checkout.id}
            value={checkout?.customer?.name}
          />
          <FormInput
            label="Email"
            name="customer.email"
            type="text"
            checkoutId={checkout.id}
            value={checkout?.customer?.email}
          />
          <FormInput
            label="Số điện thoại"
            name="customer.phone"
            type="tel"
            checkoutId={checkout.id}
            value={checkout?.customer?.phone}
          />
          <FormInput
            label="Địa chỉ"
            name="shippingAddress.address"
            type="text"
            checkoutId={checkout.id}
            value={checkout?.shippingAddress?.address}
          />
          <FormInput
            label="Phường/xã"
            name="shippingAddress.ward"
            type="text"
            checkoutId={checkout.id}
            value={checkout?.shippingAddress?.ward}
          />
          <FormInput
            label="Quận/huyện"
            name="shippingAddress.district"
            type="text"
            checkoutId={checkout.id}
            value={checkout?.shippingAddress?.district}
          />
          <FormInput
            label="Thành phố/tỉnh"
            name="shippingAddress.city"
            type="text"
            checkoutId={checkout.id}
            value={checkout?.shippingAddress?.city}
          />
          <SubmitButton label="Đăng ký" />
        </form>
      </div>
      <div className="bg-secondary p-4">
        <ul className="space-y-4">
          {checkout?.items.map((item) => (
            <li key={item.productId}>
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
                coupon?.type === "percent" && "block",
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

export default CheckoutView;

const FormInput = ({
  label,
  name,
  type,
  checkoutId,
  value: initialValue,
  ...props
}: React.ComponentProps<"input"> & {
  name: string;
  value: string | undefined;
  label: string;
  checkoutId: string;
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
      <label className="text-foreground/70 grid grid-rows-[auto_1fr]">
        {label}
        <input
          className="border border-input px-2 py-1"
          type={type}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
      </label>
    </div>
  );
};

const CouponForm = ({ checkout }: { checkout: CheckoutType }) => {
  const [code, setCode] = React.useState<string>("");
  const setCoupon = useCheckoutStore((state) => state.setCoupon);
  const { execute, result } = useAction(checkValidCouponCodeAction, {
    onSuccess: (result) => {
      if (result.data?.valid) {
        setCoupon(result.data.couponInfo);
      }
    },
    onError: (e) => {
      setCoupon(undefined);
      console.log(e.error);
    },
  });

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2 ">
      <div>
        <input
          className="border border-foreground size-full"
          name="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <span>{result?.data?.message}</span>
      </div>
      <button
        className="bg-primary text-white px-4 py-2 cursor-pointer"
        onClick={() =>
          execute({
            code,
            checkoutId: checkout.id,
          })
        }
      >
        Áp dụng
      </button>
    </div>
  );
};

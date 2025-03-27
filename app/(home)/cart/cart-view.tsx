"use client";

import { AdjustQuantityButton } from "@/components/shared/quantity-input/adjust-quantity-button";
import QuantityInput from "@/components/shared/quantity-input/index";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "@/features/cart/cart.actions";
import { CartItemDisplayType } from "@/features/cart/cart.types";
import useCartStore from "@/hooks/use-cart";
import { onActionError } from "@/lib/actions/action.helper";
import { currencyFormatter } from "@/lib/utils";
import { Result } from "@/types";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import React, { Dispatch, SetStateAction, use } from "react";
import { useDebounce } from "use-debounce";
import { CartSumary } from "./cart-sumary";

const CartView = ({
  cartPromise,
  className,
}: {
  cartPromise: Promise<
    Result<CartItemDisplayType[], { message: string; type?: string }>
  >;
  className?: string;
}) => {
  const result = use(cartPromise);
  let cartList: CartItemDisplayType[] = [];
  if (result.success) {
    cartList = result.data;
  }
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
      <div className="w-full grid grid-cols-[1fr_300px] gap-12">
        <ul className="space-y-8">
          {cartList.map((item) => (
            <li
              key={`${item.productId}-${item.variant.uniqueId}`}
              className="border border-foreground"
            >
              <CartItem item={item} />
            </li>
          ))}
        </ul>
        <div>
          <CartSumary cartList={cartList} />
        </div>
      </div>
    </div>
  );
};

export default CartView;

const CartItem = ({ item }: { item: CartItemDisplayType }) => {
  const { fetch } = useCartStore();
  const { execute, isPending } = useAction(removeItemFromCart, {
    onSuccess: () => {
      fetch();
    },
    onError: onActionError,
  });
  const { execute: updateQuantity } = useAction(updateItemQuantity, {
    onSuccess: () => {
      fetch();
    },
    onError: onActionError,
  });
  const [value, setValue] = React.useState(item.quantity.toString());
  const [debouncedValue] = useDebounce(value, 800);

  React.useEffect(() => {
    if (+debouncedValue === item.quantity) return;
    updateQuantity({
      productId: item.productId,
      variantId: item.variant.uniqueId,
      quantity: +debouncedValue,
      mode: "replace",
    });
  }, [
    debouncedValue,
    item.quantity,
    updateQuantity,
    item.productId,
    item.variant.uniqueId,
  ]);
  return (
    <>
      <div className="bg-secondary py-2 px-4 border-b border-foreground flex justify-between items-center">
        <span className="text-xl ">{item.name}</span>
        <div className="flex gap-4">
          <button className="py-1 px-4 text-sm bg-background border border-foreground cursor-pointer">
            Chọn
          </button>
          <button
            className="py-1 px-4 text-sm bg-background border border-foreground cursor-pointer"
            onClick={() =>
              execute({
                productId: item.productId,
                variantId: item.variant.uniqueId,
              })
            }
            disabled={isPending}
          >
            Xóa
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[200px_1fr] gap-8 py-6 px-4">
        <Image
          src={item.variant.images[0]}
          className="w-[200px] aspect-[16/9]"
          width={300}
          height={200}
          alt={item.name}
        />
        <div className="grid grid-cols-[1fr_16rem] gap-4">
          <ul className="text-foreground/70">
            {item.variant.attributes.map((attr) => (
              <li key={attr.name} className="flex items-center gap-2">
                <span className="font-medium capitalize">{attr.name}</span>
                <span className="overflow-ellipsis">{attr.value}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
              <span className="font-medium capitalize">Đơn giá</span>
              <span className="text-end">
                {currencyFormatter.format(item.variant.price)}
              </span>
            </div>
            <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
              <span className="font-medium capitalize">Số lượng</span>
              <CartQuantityInput
                value={value}
                setValue={setValue}
                max={item.variant.countInStock}
              />
            </div>
            <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
              <span className="font-medium capitalize">Tổng giá</span>
              <span className="text-end">
                {currencyFormatter.format(item.quantity * item.variant.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CartQuantityInput = ({
  value,
  setValue,
  max,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  max: number;
}) => {
  return (
    <div className="focus-within:border-primary w-full grid grid-cols-[auto_1fr_auto] gap-2 border border-foreground">
      <AdjustQuantityButton
        className="border-0 px-2"
        type="decrease"
        onClick={() =>
          setValue((prev) =>
            prev === "" ? "1" : Math.max(1, +prev - 1).toString(),
          )
        }
        disabled={value === "1"}
      />
      <QuantityInput
        className="border-0 focus-visible:outline-none w-full"
        value={value}
        setValue={setValue}
        max={max}
      />
      <AdjustQuantityButton
        className="border-0 px-2"
        type="increase"
        onClick={() =>
          setValue((prev) =>
            prev === "" ? "1" : Math.min(max, +prev + 1).toString(),
          )
        }
        disabled={+value === max}
      />
    </div>
  );
};

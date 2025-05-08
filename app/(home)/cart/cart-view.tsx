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
import { cn, currencyFormatter, getLink } from "@/lib/utils";
import { Result } from "@/types";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import React, { Dispatch, SetStateAction, use } from "react";
import { useDebounce } from "use-debounce";
import { CartSumary } from "./cart-sumary";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

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
  const items = useCartStore((state) => state.items);
  const setWithLocalStorage = useCartStore(
    (state) => state.setWithLocalStorage,
  );
  const setItems = useCartStore((state) => state.setItems);
  const authInfo = useAuth();

  React.useEffect(() => {
    if (!result.success) return;
    setItems({
      items: result.data,
      type: "server",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  React.useEffect(() => {
    if (authInfo.isLoading || authInfo.user) return;

    setWithLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authInfo.isLoading]);

  const cartList = items;

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
      <div className="w-full grid lg:grid-cols-[1fr_300px] gap-12">
        <ul className="space-y-8">
          {cartList.length === 0 && (
            <li className="text-center">Chưa có sản phẩm trong giỏ hàng</li>
          )}
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
          <CartSumary />
        </div>
      </div>
    </div>
  );
};

export default CartView;

const CartItem = ({ item }: { item: CartItemDisplayType }) => {
  const toggleSelectedItems = useCartStore(
    (state) => state.toggleSelectedItems,
  );
  const selectedItems = useCartStore((state) => state.selectedItems);
  const cartFrom = useCartStore((state) => state.type);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);

  const { execute: removeCartItemFromServer, isPending } = useAction(
    removeItemFromCart,
    {
      onSuccess: () => {},
      onError: onActionError,
    },
  );
  const { execute: updateQuantity } = useAction(updateItemQuantity, {
    onSuccess: () => {},
    onError: onActionError,
  });
  const [value, setValue] = React.useState(item.quantity.toString());
  const [debouncedValue] = useDebounce(value, 500);

  React.useEffect(() => {
    // this for local cart, with no delay update cart
    if (cartFrom === "local") {
      addToCart(
        {
          ...item,
          quantity: Number(value),
        },
        "replace",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  React.useEffect(() => {
    // for server cart
    if (+debouncedValue === item.quantity) return;
    if (cartFrom === "server") {
      updateQuantity({
        productId: item.productId,
        variantId: item.variant.uniqueId,
        quantity: +debouncedValue,
        mode: "replace",
      });
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedValue,
    item.quantity,
    updateQuantity,
    item.productId,
    item.variant.uniqueId,
  ]);

  const total = item.quantity * item.variant.price;

  const isSelected = selectedItems.some(
    (selectedItem) =>
      selectedItem.productId === item.productId &&
      selectedItem.variant.uniqueId === item.variant.uniqueId,
  );

  return (
    <div className="">
      <div
        className={cn(
          "bg-secondary px-1 py-2 md:py-2 md:px-4 border-b border-foreground flex justify-between items-center",
          isSelected && "bg-primary/50",
        )}
      >
        <Link
          href={getLink.product.home({
            categorySlug: item.category.slug,
            productSlug: item.slug,
            attributes: item.variant.attributes,
          })}
          className="text-xl hover:underline"
        >
          {item.name}
        </Link>
        <div className="flex gap-4">
          <button
            className="py-1 px-4 text-sm bg-background border border-foreground cursor-pointer"
            onClick={() => toggleSelectedItems(item)}
          >
            {isSelected ? " Bỏ chọn" : "Chọn"}
          </button>
          <button
            className="py-1 px-4 text-sm bg-background border border-foreground cursor-pointer"
            onClick={() => {
              if (cartFrom === "server") {
                // for server cart
                removeCartItemFromServer({
                  productId: item.productId,
                  variantId: item.variant.uniqueId,
                });

                return;
              }
              // for local cart
              removeFromCart(item);
            }}
            disabled={isPending}
          >
            {isPending ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-2 md:gap-8 px-1 py-2 md:py-6 md:px-4">
        <Link
          href={getLink.product.home({
            categorySlug: item.category.slug,
            productSlug: item.slug,
            attributes: item.variant.attributes,
          })}
        >
          <Image
            src={item.variant.images[0]}
            className="w-[180px] aspect-[16/9]"
            width={180}
            height={120}
            alt={item.name}
          />
        </Link>
        <div className="grid grid-cols-[1fr_20rem] gap-4 max-md:contents">
          <div>
            <ul className="text-foreground/70">
              {item.variant.attributes.map((attr) => (
                <li key={attr.name} className="flex items-center gap-2">
                  <span className="font-medium capitalize">{attr.name}</span>
                  <span className="overflow-ellipsis">{attr.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1 max-md:col-span-2 max-md:border-t border-t-foreground max-md:-mx-4 max-md:px-4 max-md:py-2">
            <div className="grid grid-cols-[1fr_9rem] gap-2 items-center">
              <span className="font-medium capitalize">Đơn giá</span>
              <span className="text-end">
                {currencyFormatter.format(item.variant.price)}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_9rem] gap-2 items-center">
              <span className="font-medium capitalize">
                {`Số lượng${
                  item.variant.countInStock - item.quantity < 10
                    ? ` (Kho: ${item.variant.countInStock})`
                    : ""
                }`}
              </span>
              <CartQuantityInput
                value={value}
                setValue={setValue}
                max={item.variant.countInStock}
              />
            </div>
            <div className="grid grid-cols-[1fr_9rem] gap-2 items-center">
              <span className="font-medium capitalize">Tổng giá</span>
              <span className="text-end">
                {+value === item.quantity
                  ? currencyFormatter.format(total)
                  : "Đang xử lý..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  React.useEffect(() => {
    if (+value > max) {
      setValue(max.toString());
    }
  }, [max, value, setValue]);

  return (
    <div
      className={cn(
        "focus-within:border-primary w-full grid grid-cols-[auto_1fr_auto] gap-2 border border-foreground",
        +value > max && "border-destructive",
      )}
    >
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

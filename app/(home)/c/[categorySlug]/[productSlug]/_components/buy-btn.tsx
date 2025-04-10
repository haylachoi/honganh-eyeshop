"use client";

import React from "react";
import { TopContext } from "./top-section";
import { cn } from "@/lib/utils";
import { addItemToCart } from "@/features/cart/cart.actions";
import useCartStore from "@/hooks/use-cart";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import QuantityInput from "@/components/shared/quantity-input/index";
import { AdjustQuantityButton } from "@/components/shared/quantity-input/adjust-quantity-button";
import { useAuth } from "@/hooks/use-auth";
// import { useLocalStorage } from "@/hooks/use-local-storage";
// import { CartItemDisplayType } from "@/features/cart/cart.types";

const BuyButton = () => {
  const { currentVariant, product } = React.use(TopContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const [value, setValue] = React.useState("1");
  const max = currentVariant?.countInStock ?? 1;
  const { user, isLoading: isAuthLoading } = useAuth();
  // const [localCartList, setLocalCart] = useLocalStorage<CartItemDisplayType[]>(
  //   "cart",
  //   [],
  // );

  React.useEffect(() => {
    setValue("1");
  }, [currentVariant?.uniqueId]);

  const canBuy =
    currentVariant && +value <= currentVariant.countInStock && +value > 0;
  const handleBuy = async () => {
    if (!canBuy) {
      toast.error(TOAST_MESSAGES.PRODUCT.NOT_ENOUGH_STOCK);
      return;
    }
    if (isAuthLoading) return;
    const cartItem = {
      productId: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      slug: product.slug,
      tags: product.tags,
      quantity: +value,
      variant: currentVariant,
    };

    if (!user) {
      try {
        addToCart(cartItem);
        toast.success(TOAST_MESSAGES.CART.ADD.SUCCESS);
      } catch (e) {
        console.error(e);
      }
      // todo: use local storage
      // const exist = localCartList.find(
      //   (item) =>
      //     item.productId === product.id &&
      //     item.variant.uniqueId === currentVariant.uniqueId,
      // );
      // if (exist) {
      //   exist.quantity += +value;
      //   setLocalCart(localCartList);
      // } else {
      //   setLocalCart([...localCartList, cartItem]);
      // }
      return;
    }

    if (currentVariant) {
      addToCart(cartItem);
      const result = await addItemToCart({
        productId: product.id,
        variantId: currentVariant.uniqueId,
        quantity: +value,
      });

      if (result?.data) {
        toast.success(TOAST_MESSAGES.CART.ADD.SUCCESS);
      }

      if (result?.serverError || result?.validationErrors) {
        addToCart({
          productId: product.id,
          name: product.name,
          category: product.category,
          brand: product.brand,
          slug: product.slug,
          tags: product.tags,
          quantity: -Number(value),
          variant: currentVariant,
        });
        toast.error(result.serverError?.message);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse lg:justify-end gap-5">
      <div className="flex items-center gap-2">
        <AdjustQuantityButton
          type="decrease"
          onClick={() =>
            setValue((prev) =>
              prev === "" ? "1" : Math.max(1, +prev - 1).toString(),
            )
          }
          disabled={value === "1"}
        />
        <QuantityInput
          className="max-w-16"
          value={value}
          setValue={setValue}
          max={max}
        />
        <AdjustQuantityButton
          type="increase"
          onClick={() =>
            setValue((prev) =>
              prev === "" ? "1" : Math.min(max, +prev + 1).toString(),
            )
          }
          disabled={+value === max}
        />
      </div>
      <button
        className={cn(
          "cursor-pointer bg-primary text-primary-foreground px-4 py-2",
          !canBuy && "opacity-50",
        )}
        onClick={handleBuy}
        disabled={!canBuy}
      >
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default BuyButton;

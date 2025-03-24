"use client";

import React from "react";
import { TopContext } from "./top-section";
import { cn } from "@/lib/utils";
import { addItemToCart } from "@/features/cart/cart.actions";
import useCartStore from "@/hooks/use-cart";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";

const BuyButton = () => {
  const { currentVariant, product } = React.use(TopContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const [value, setValue] = React.useState("1");
  const max = currentVariant?.countInStock ?? 1;

  React.useEffect(() => {
    setValue("1");
  }, [currentVariant?.uniqueId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    if (inputValue === "") {
      setValue("");
      return;
    }

    const numValue = Math.min(+inputValue, max);
    setValue(numValue.toString());
  };

  const handleBlur = () => {
    if (value === "" || value === "0") {
      setValue("1");
    }
  };

  const canBuy =
    currentVariant && +value <= currentVariant.countInStock && +value > 0;
  const handleBuy = async () => {
    if (!canBuy) {
      console.log("not enough");
      toast.error(TOAST_MESSAGES.PRODUCT.NOT_ENOUGH_STOCK);
      return;
    }
    if (currentVariant) {
      addToCart({
        variantId: currentVariant.uniqueId,
        productId: product.id,
        quantity: +value,
        countInStock: currentVariant.countInStock,
        attributes: currentVariant.attributes,
        price: currentVariant.price,
        originPrice: currentVariant.price,
      });
      const result = await addItemToCart({
        productId: product.id,
        variantId: currentVariant.uniqueId,
        quantity: +value,
      });

      if (result?.serverError || result?.validationErrors) {
        addToCart({
          variantId: currentVariant.uniqueId,
          productId: product.id,
          quantity: -Number(value),
          countInStock: currentVariant.countInStock,
          attributes: currentVariant.attributes,
          price: currentVariant.price,
          originPrice: currentVariant.price,
        });
        toast.error(result.serverError);
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
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="border p-2 w-16 text-center"
          placeholder="Nhập số"
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

const AdjustQuantityButton = ({
  type,
  onClick,
  disabled,
  className,
}: {
  type: "increase" | "decrease";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 py-1 border cursor-pointer",
        className,
        disabled && "opacity-50",
      )}
    >
      {type === "increase" ? "+" : "-"}
    </button>
  );
};

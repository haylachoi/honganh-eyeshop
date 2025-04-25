"use client";

import { createCheckoutAction } from "@/features/checkouts/checkout.actions";
import useCartStore from "@/hooks/use-cart";
import { onActionError } from "@/lib/actions/action.helper";
import { cn, getLink } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

export const CartSumary = () => {
  const router = useRouter();
  const selectedItems = useCartStore((state) => state.selectedItems);
  const clearSelectedItems = useCartStore((state) => state.clearSelectedItems);
  const { execute, isPending } = useAction(createCheckoutAction, {
    onSuccess: (result) => {
      clearSelectedItems();
      if (result.data) {
        router.push(getLink.checkout.home({ checkoutId: result.data }));
      }
    },
    onError: onActionError,
  });
  const items = useCartStore((state) => state.items);
  const cartList = selectedItems.length > 0 ? selectedItems : items;

  const total =
    cartList.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.variant.price,
      0,
    ) || 0;

  const totalQuantity =
    cartList.reduce((acc, cartItem) => acc + cartItem.quantity, 0) || 0;

  return (
    <div className="p-4 border border-foreground flex flex-col gap-6">
      <h3 className="text-3xl font-medium text-primary">Đơn hàng</h3>
      <div>
        <SummaryRow label="Số lượng" value={totalQuantity} />
        <SummaryRow label="Tổng tiền" value={total} />
      </div>
      <button
        className={cn(
          "cursor-pointer bg-primary text-white px-4 py-2",
          cartList.length === 0 && "opacity-50",
        )}
        onClick={() => {
          execute({
            items: cartList.map((item) => ({
              productId: item.productId,
              variantId: item.variant.uniqueId,
              productName: item.name,
              price: item.variant.price,
              productUrl: getLink.product.home({
                categorySlug: item.category.slug,
                productSlug: item.slug,
              }),
              quantity: item.quantity,
              imageUrl: item.variant.images[0],
              attributes: item.variant.attributes,
            })),
            paymentMethod: "cod",
          });
        }}
        disabled={isPending || cartList.length === 0}
      >
        Thanh toán
      </button>
    </div>
  );
};

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="grid grid-cols-2">
    <span className="font-medium">{label}</span>
    <span className="text-end">{value}</span>
  </div>
);

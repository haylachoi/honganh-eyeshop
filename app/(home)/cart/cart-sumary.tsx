import { CartItemDisplayType } from "@/features/cart/cart.types";

export const CartSumary = ({
  cartList,
}: {
  cartList: CartItemDisplayType[];
}) => {
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

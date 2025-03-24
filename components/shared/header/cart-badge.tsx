import { getCartByUserId } from "@/features/cart/cart.queries";

export const CartBadge = async () => {
  const result = await getCartByUserId();
  return <div>{JSON.stringify(result)}</div>;
};

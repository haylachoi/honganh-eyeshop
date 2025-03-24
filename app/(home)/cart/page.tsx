import { getCartByUserId } from "@/features/cart/cart.queries";

export const CartPage = async () => {
  const result = await getCartByUserId();
  console.log(result);
  return <div>{JSON.stringify(result)}</div>;
};

export default CartPage;

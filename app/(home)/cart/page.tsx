import { getCartWithProductDetailBySession } from "@/features/cart/cart.queries";
import { Suspense } from "react";
import CartView from "./cart-view";
import { LoadingIndicator } from "@/components/shared/loading-indicator";

export const dynamic = "force-dynamic";

const CartPage = async () => {
  const cartResult = getCartWithProductDetailBySession();

  return (
    <div className="container">
      <Suspense fallback={<LoadingIndicator />}>
        <CartView className="overflow-x-hidden" cartPromise={cartResult} />
      </Suspense>
    </div>
  );
};

export default CartPage;

import { getCheckoutById } from "@/features/checkouts/checkout.queries";
import CheckoutView from "./checkout-view";

type Params = Promise<{ checkoutId: string }>;
const CheckoutPage = async ({ params }: { params: Params }) => {
  const { checkoutId } = await params;
  const checkoutResult = await getCheckoutById(checkoutId);
  if (!checkoutResult.success) {
    return <div>Error</div>;
  }

  const checkout = checkoutResult.data;

  return (
    <div className="container">
      <h1>Checkout</h1>
      <CheckoutView checkout={checkout} />
    </div>
  );
};

export default CheckoutPage;

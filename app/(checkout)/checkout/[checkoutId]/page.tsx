import { getCheckoutById } from "@/features/checkouts/checkout.queries";
import CheckoutForm from "./checkout-form";
import { CompletedCheckoutView } from "./completed-checkout-view";

type Params = Promise<{ checkoutId: string }>;
const CheckoutPage = async ({ params }: { params: Params }) => {
  const { checkoutId } = await params;
  const checkoutResult = await getCheckoutById(checkoutId);
  if (!checkoutResult.success) {
    // todo: handle error
    return <div>Check out không tồn tại</div>;
  }

  const checkout = checkoutResult.data;

  return (
    <div>
      {checkout.isOrderd ? (
        <CompletedCheckoutView className="container" checkout={checkout} />
      ) : (
        <>
          <h1 className="container text-3xl font-bold mb-4">Checkout</h1>
          <div className="lg:bg-[linear-gradient(to_right,var(--background)_50%,var(--secondary)_50%)] lg:border-t border-input pt-4">
            <CheckoutForm className="container" checkout={checkout} />
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;

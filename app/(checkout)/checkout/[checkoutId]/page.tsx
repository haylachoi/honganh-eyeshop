import { getCheckoutById } from "@/features/checkouts/checkout.queries";
import CheckoutForm from "./checkout-form";
import { CompletedCheckoutView } from "./completed-checkout-view";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ENDPOINTS } from "@/constants";

type Params = Promise<{ checkoutId: string }>;
const CheckoutPage = async ({ params }: { params: Params }) => {
  const { checkoutId } = await params;
  const checkoutResult = await getCheckoutById(checkoutId);
  if (!checkoutResult.success) {
    // todo: handle error
    return <CheckoutNotFound />;
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

const CheckoutNotFound = () => {
  return (
    <div className="container max-w-md mx-auto mt-24 text-center">
      <div className="p-6 bg-red-50 text-red-900 rounded-xl">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
        <h2 className="text-xl font-semibold mb-1">Checkout không tồn tại</h2>
        <p className="text-sm text-red-800 mb-5">
          Liên kết không hợp lệ hoặc đã hết hạn.
        </p>
        <Link
          href={ENDPOINTS.HOME}
          className="inline-block text-sm font-medium px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

import { CheckoutHeader } from "./checkout/checkout-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <CheckoutHeader />
      {children}
    </div>
  );
}

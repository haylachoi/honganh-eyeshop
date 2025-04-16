import { ENDPOINTS } from "@/constants";
import Link from "next/link";

export const CheckoutHeader = () => {
  return (
    <div className="container py-4">
      {/* todo : logo */}
      <Link href={ENDPOINTS.HOME}>Logo</Link>
    </div>
  );
};

import { ENDPOINTS } from "@/constants/endpoints.constants";
import Link from "next/link";

export const SimpleHeader = () => {
  return (
    <div className="container py-4">
      {/* todo : logo */}
      <Link href={ENDPOINTS.HOME}>Logo</Link>
    </div>
  );
};

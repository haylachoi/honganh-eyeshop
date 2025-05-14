import { ENDPOINTS } from "@/constants/endpoints.constants";
import Image from "next/image";
import Link from "next/link";

export const SimpleHeader = () => {
  return (
    <div className="container py-4">
      <Link href={ENDPOINTS.HOME}>
        <Image src="/logo.svg" alt="logo" width={64} height={64} />
      </Link>
    </div>
  );
};

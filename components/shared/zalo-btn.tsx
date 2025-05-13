import { ZALO_LINK } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export const ZaloButton = () => {
  return (
    <Link
      className="fixed bottom-[10px] right-[10px]"
      href={ZALO_LINK}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image src="/zalo.svg" alt="Zalo" width={50} height={50} />
    </Link>
  );
};

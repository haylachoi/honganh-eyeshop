import { FACEBOOK_LINK, ZALO_LINK } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export const FloatingSupportBtn = () => {
  return (
    <div className="fixed bottom-[30px] right-[10px] flex flex-col gap-2">
      <Link href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
        <Image src="/zalo.svg" alt="Zalo" width={50} height={50} />
      </Link>
      <Link href={FACEBOOK_LINK} target="_blank" rel="noopener noreferrer">
        <Image
          src="/facebook-messenger.svg"
          alt="Zalo"
          width={50}
          height={50}
        />
      </Link>
    </div>
  );
};

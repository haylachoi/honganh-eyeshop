import { getLink } from "@/lib/utils";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const BottomHeader = () => {
  return (
    <div className="w-full text-background bg-foreground">
      <div className="container py-4 flex items-center justify-center gap-20">
        <div>20% OFF</div>
        <Link
          href={getLink.search({
            queries: [{ key: "tag", value: "deal-hot" }],
          })}
          className="flex items-center justify-start gap-2 group cursor-pointer"
        >
          <span>Hàng Hot</span>
          <MoveRightIcon className="h-5 w-5 group-hover:translate-x-2 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default BottomHeader;

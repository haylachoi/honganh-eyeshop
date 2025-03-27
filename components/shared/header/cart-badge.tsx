"use client";
import { ENDPOINTS } from "@/constants";
import useCartStore from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

export const CartBadge = () => {
  const { fetch, items } = useCartStore();
  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Link href={ENDPOINTS.CART} className="relative">
      <ShoppingCart className="size-6" />
      <div className="absolute -right-1/2 -top-1/2 size-5 rounded-full text-sm bg-destructive text-destructive-foreground grid place-content-center">
        {items.length}
      </div>
    </Link>
  );
};

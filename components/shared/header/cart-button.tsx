"use client";

import { ENDPOINTS } from "@/constants";
import useCartStore from "@/hooks/use-cart";
import { useLoadCart } from "@/hooks/use-load-cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

export const CartButton = () => {
  const items = useCartStore((state) => state.items);
  useLoadCart();

  return (
    <Link href={ENDPOINTS.CART} className="relative">
      <ShoppingCart className="size-6" />
      <div className="absolute -right-1/2 -top-1/2 size-5 rounded-full text-sm bg-destructive text-destructive-foreground grid place-content-center">
        {items.reduce((acc, item) => acc + item.quantity, 0)}
      </div>
    </Link>
  );
};

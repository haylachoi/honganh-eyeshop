"use client";

import React from "react";
import { NavigationMenu } from "./header-navigation";
import { CircleUserRound, MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ENDPOINTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import useCartStore from "@/hooks/use-cart";
import { CartBadge } from "./cart-badge";

const TopHeader = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
  return (
    <div className={cn("h-[48px] w-full lg:relative", className)}>
      <div className="container h-full flex items-center justify-between gap-4">
        <Logo />
        <div className="max-lg:h-0 h-full max-lg:overflow-hidden max-lg:has-[>#header-navigation-trigger:checked]:grid max-lg:absolute z-50 left-0 top-[48px] max-lg:w-full max-lg:has-[>#header-navigation-trigger:checked]:h-[calc(100dvh-48px)] grid-rows-[auto_auto_1fr] transition-all">
          <div className="w-full h-1 bg-foreground lg:hidden" />
          <input
            type="checkbox"
            id="header-navigation-trigger"
            className="hidden"
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />
          <div className="max-lg:bg-background overflow-y-auto overscroll-contain">
            <NavigationMenu className="max-lg:container h-full overscroll-contain" />
          </div>
          <label
            htmlFor="header-navigation-trigger"
            className="lg:hidden bg-black/70 cursor-pointer"
          />
        </div>
        <ActionButtons />
      </div>
    </div>
  );
};

export default TopHeader;

const Logo = () => {
  return <Link href={ENDPOINTS.HOME}>Logo</Link>;
};

const ActionButtons = () => {
  const items = useCartStore((state) => state.items);
  // const { user } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <div>items: {items?.[0]?.quantity}</div>
      {/* <CartBadge /> */}
      <label
        htmlFor="header-navigation-trigger"
        className="flex py-2 items-center gap-2 cursor-pointer lg:hidden"
      >
        <MenuIcon />
      </label>
      <Link href={ENDPOINTS.LOGIN} className="cursor-pointer">
        <CircleUserRound />
      </Link>
    </div>
  );
};

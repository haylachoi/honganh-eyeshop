import React from "react";
import { NavigationMenu } from "./header-navigation";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ENDPOINTS } from "@/constants/endpoints.constants";
import { CartButton } from "./cart-button";
import UserButton from "../user-button";
import SearchBox from "./search-box";
import Image from "next/image";
import { RerenderOnNavigate } from "../rerender-on-navigate";

const TopHeader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("h-[48px] w-full lg:relative z-index-40", className)}>
      <div className="container h-full flex items-center justify-between gap-4">
        <Logo />
        <div className="max-lg:h-0 h-full max-lg:overflow-hidden max-lg:has-[>#header-navigation-trigger:checked]:grid max-lg:absolute z-50 left-0 top-[48px] max-lg:w-full max-lg:has-[>#header-navigation-trigger:checked]:h-[calc(100dvh-48px)] grid-rows-[auto_auto_1fr] transition-all">
          <div className="w-full h-1 bg-foreground lg:hidden" />
          <input
            type="checkbox"
            id="header-navigation-trigger"
            className="hidden"
          />
          <div className="max-lg:bg-background overflow-y-auto">
            <RerenderOnNavigate>
              <NavigationMenu className="max-lg:container h-full" />
            </RerenderOnNavigate>
          </div>
          <label
            htmlFor="header-navigation-trigger"
            className="lg:hidden bg-black/70 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-4">
          <SearchBox />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

const Logo = () => {
  return (
    <Link href={ENDPOINTS.HOME}>
      <Image src="/logo.svg" alt="logo" width={36} height={36} />
    </Link>
  );
};

const ActionButtons = () => {
  return (
    <div className="flex items-center gap-6">
      <CartButton />
      <UserButton />
      <label
        htmlFor="header-navigation-trigger"
        className="flex py-2 items-center gap-2 cursor-pointer lg:hidden"
      >
        <MenuIcon />
      </label>
    </div>
  );
};

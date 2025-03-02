import React from "react";
import { NavigationMenu } from "./header-navigation";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TopHeader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("h-[48px] w-full lg:relative", className)}>
      <div className="container h-full flex items-center justify-between gap-4">
        <Logo />
        <div className="max-lg:h-0 h-full max-lg:overflow-hidden max-lg:has-[>#header-navigation-trigger:checked]:grid max-lg:fixed left-0 top-0 max-lg:bg-background max-lg:w-full max-lg:has-[>#header-navigation-trigger:checked]:h-dvh grid-rows-[auto_auto_1fr] transition-all">
          <div className="w-full h-1 bg-foreground lg:hidden" />
          <input
            type="checkbox"
            id="header-navigation-trigger"
            className="hidden"
          />
          <NavigationMenu className="max-lg:container h-full max-lg:overflow-y-auto overscroll-contain" />
          <label
            htmlFor="header-navigation-trigger"
            className="lg:hidden bg-black/70"
          />
        </div>
        <ActionButtons />
      </div>
    </div>
  );
};

export default TopHeader;

const Logo = () => {
  return <div>Logo</div>;
};

const ActionButtons = () => {
  return (
    <div>
      <label
        htmlFor="header-navigation-trigger"
        className="flex py-2 items-center gap-2 cursor-pointer lg:hidden"
      >
        <MenuIcon />
      </label>
    </div>
  );
};

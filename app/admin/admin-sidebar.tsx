import { LogoutButton } from "@/components/shared/logout-button";
import AdminNavigation from "./admin-navigation";
import { ENDPOINTS } from "@/constants/endpoints.constants";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { auth } from "@/features/auth/auth.auth";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarToggle } from "./sidebar-toggle";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const AdminSidebar = async () => {
  const user = await auth();
  return (
    <div className="@container sticky top-0 border-r border-input h-dvh grid grid-rows-[auto_1fr_auto] px-4 gap-2">
      <div className="py-2">
        <div className="flex items-center justify-between h-[80px] overflow-hidden">
          <Link
            href={ENDPOINTS.HOME}
            className="text-2xl font-bold hidden @sidebar:inline-block"
          >
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
          </Link>
          <label className="cursor-pointer">
            <SidebarToggle />
            <PanelLeftOpen className="w-5 h-5 @sidebar:hidden" />
            <PanelLeftClose className="w-5 h-5 hidden @sidebar:inline-block" />
          </label>
        </div>
        <Separator />
        <div className="my-2">
          <div className="flex items-center gap-2 h-[40px] my-2">
            <UserAvatar
              user={user}
              className="size-6 rounded-full overflow-hidden border border-foreground shrink-0"
            />
            <div className="hidden @sidebar:inline-block font-medium">
              {user?.name}
            </div>
          </div>
          <div className="hidden @sidebar:inline-block text-center text-muted-foreground w-full">
            {user?.role}
          </div>
        </div>
        <Separator />
      </div>
      <div className="overflow-y-auto">
        <AdminNavigation />
      </div>
      <div className="py-2 border-t border-input">
        <LogoutButton className="flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          <span className="hidden @sidebar:inline-block">Đăng xuất</span>
        </LogoutButton>
      </div>
    </div>
  );
};

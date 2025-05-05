import { LogoutButton } from "@/components/shared/logout-button";
import AdminNavigation from "./admin-navigation";
import { ENDPOINTS } from "@/constants";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { auth } from "@/features/auth/auth.auth";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarToggle } from "./sidebar-toggle";

export const AdminSidebar = async () => {
  const user = await auth();
  return (
    <div className="@container sticky top-0 border-r border-input h-dvh grid grid-rows-[auto_1fr_auto] px-4 gap-4">
      <div className="border-b border-input py-4">
        <div className="flex items-center justify-between h-[60px]">
          <Link
            href={ENDPOINTS.HOME}
            className="text-2xl font-bold hidden @sidebar:inline-block"
          >
            Logo
          </Link>
          <label className="cursor-pointer">
            <SidebarToggle />
            <PanelLeftOpen className="w-5 h-5 @sidebar:hidden" />
            <PanelLeftClose className="w-5 h-5 hidden @sidebar:inline-block" />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <UserAvatar
            user={user}
            className="size-6 rounded-full overflow-hidden"
          />
          <p className="hidden @sidebar:inline-block">{user?.name}</p>
        </div>
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

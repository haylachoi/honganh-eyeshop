"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENDPOINTS } from "@/constants/endpoints.constants";
import { useAuth } from "@/hooks/use-auth";

const info = [
  {
    title: "Cá nhân",
    href: ENDPOINTS.PROFILE.USER_INFO,
    icon: <User className="w-4 h-4 mr-2" />,
  },
  {
    title: "Địa chỉ",
    href: ENDPOINTS.PROFILE.USER_ADDRESS,
    icon: <MapPin className="w-4 h-4 mr-2" />,
  },
  {
    title: "Mật khẩu",
    href: ENDPOINTS.PROFILE.USER_PASSWORD,
    icon: <Lock className="w-4 h-4 mr-2" />,
  },
];

export function ProfileSidebar({ className }: { className?: string }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const buttonInfo = info;

  if (
    user &&
    user.role !== "customer" &&
    !buttonInfo.some((item) => item.href === ENDPOINTS.PROFILE.USER_PERMISSION)
  ) {
    buttonInfo.push({
      title: "Quyền truy cập",
      href: ENDPOINTS.PROFILE.USER_PERMISSION,
      icon: <Shield className="w-4 h-4 mr-2" />,
    });
  }
  return (
    <ul className={cn("", className)}>
      {buttonInfo.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2 rounded-md transition-colors",
              pathname === item.href && "bg-primary text-white font-medium",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

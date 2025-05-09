"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENDPOINTS } from "@/constants/endpoints.constants";

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
  const pathname = usePathname();

  return (
    <ul className={cn("", className)}>
      {info.map((item) => (
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

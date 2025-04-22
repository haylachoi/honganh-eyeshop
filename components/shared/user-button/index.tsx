"use client";

import { ENDPOINTS } from "@/constants";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import UserButtonContent from "./user-button.content";
import { useAuth } from "@/hooks/use-auth";

const UserButton = () => {
  const result = useAuth();
  if (result.isLoading) {
    return <div>...</div>;
  }

  const user = result.user;

  if (!user) {
    return (
      <Link href={ENDPOINTS.AUTH.LOGIN} className="cursor-pointer">
        <CircleUserRound className="size-6" />
      </Link>
    );
  }

  return <UserButtonContent user={user} />;
};

export default UserButton;

"use client";

import { useEffect, useState } from "react";
import { SafeUserInfo } from "@/features/auth/auth.type";

export function useAuth() {
  const [user, setUser] = useState<SafeUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}

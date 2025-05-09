"use client";

import { VIEWS_COUNT_CONFIG } from "@/constants";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";
import { Role } from "@/features/authorization/authorization.constants";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export const ViewCount = () => {
  const { user } = useAuth();
  useEffect(() => {
    const timer = setTimeout(() => {
      const role: Role = "customer";
      if (user && user.role !== role) {
        return;
      }

      fetch(API_ENDPOINTS.VIEW_COUNT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }, VIEWS_COUNT_CONFIG.DELAY_THRESHOLD);

    return () => clearTimeout(timer);
  }, [user]);
  return null;
};

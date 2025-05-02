import { create } from "zustand";
import { SafeUserInfoFromSession } from "@/features/users/user.types";
import { useEffect } from "react";

type AuthState = {
  user: SafeUserInfoFromSession | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        set({ user: data.user });
        return;
      }
    } catch (e) {
      console.error("Failed to fetch user", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useAuth = () => {
  const { user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoading };
};

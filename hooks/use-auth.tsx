import { create } from "zustand";
import { SafeUserInfoFromSession } from "@/features/users/user.types";
import { useEffect } from "react";

type AuthState = {
  user: SafeUserInfoFromSession | null;
  isLoading: boolean;
  hasFetched: boolean;
  isFetching: boolean;
  fetchUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isFetching: false,
  hasFetched: false,
  fetchUser: async () => {
    const { hasFetched, isFetching } = get();
    if (hasFetched || isFetching) return;

    set({ isFetching: true, isLoading: true });

    try {
      const res = await fetch("/api/auth");
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      if (data.success) {
        set({ user: data.user, hasFetched: true });
      }
    } catch (e) {
      console.error("fetch error", e);
      set({ hasFetched: false });
    } finally {
      set({ isFetching: false, isLoading: false });
    }
  },
}));

export const useAuth = () => {
  const { user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading };
};

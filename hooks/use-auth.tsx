import { create } from "zustand";
import { SafeUserInfo } from "@/features/auth/auth.type";
import { useEffect } from "react";

type AuthState = {
  user: SafeUserInfo | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      set({ user: data.user });
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

// import { useEffect, useState } from "react";
// import { SafeUserInfo } from "@/features/auth/auth.type";
//
// export function useAuth() {
//   const [user, setUser] = useState<SafeUserInfo | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await fetch("/api/auth");
//         const data = await res.json();
//         setUser(data.user);
//       } catch (e) {
//       } finally {
//         setIsLoading(false);
//       }
//     }
//
//     fetchUser();
//   }, []);
//
//   return { user, isLoading };
// }

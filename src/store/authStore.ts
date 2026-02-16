import { create } from "zustand";
import { User } from "@/lib/types";
import { authStorage } from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user: User, token: string) => {
    authStorage.setToken(token);
    authStorage.setUser(user);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    authStorage.clear();
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Called on app load to restore session from localStorage
  hydrate: () => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
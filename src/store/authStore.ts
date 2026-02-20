import { create } from "zustand";
import { User, Organization } from "@/lib/types";
import { authStorage } from "@/lib/auth";

interface AuthState {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (
    user: User,
    token: string,
    organization?: Organization | null,
  ) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user: User, token: string, organization = null) => {
    authStorage.setToken(token);
    authStorage.setUser(user);

    // Store organization separately if provided
    if (organization) {
      localStorage.setItem(
        "boaflow_organization",
        JSON.stringify(organization),
      );
    }

    set({ user, token, organization, isAuthenticated: true });
  },

  clearAuth: () => {
    authStorage.clear();
    localStorage.removeItem("boaflow_organization");
    set({
      user: null,
      token: null,
      organization: null,
      isAuthenticated: false,
    });
  },

  // Called on app load to restore session from localStorage
  hydrate: () => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    const orgData = localStorage.getItem("boaflow_organization");
    const organization = orgData ? JSON.parse(orgData) : null;

    if (token && user) {
      set({ user, token, organization, isAuthenticated: true });
    }
  },
}));

import { create } from "zustand";
import { AuthState, LoginCredentials } from "@/types/auth.types";
import { login as apiLogin, getCurrentUser } from "@/services/api/auth.service";

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await apiLogin(credentials);
      // Store in local storage and cookies for PWA & middleware persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("cap_token", token);
        document.cookie = `cap_auth=${token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `cap_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
      }
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cap_token");
      document.cookie = "cap_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "cap_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  initialize: async () => {
    if (get().isAuthenticated) return;
    
    set({ isLoading: true });
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cap_token") : null;
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const user = await getCurrentUser(token);
      if (user) {
        if (typeof window !== "undefined") {
          document.cookie = `cap_auth=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `cap_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ user, token, isAuthenticated: true });
      } else {
        localStorage.removeItem("cap_token");
        if (typeof window !== "undefined") {
          document.cookie = "cap_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "cap_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    } catch (err: any) {
      console.error("Auth initialization failed:", err);
    } finally {
      set({ isLoading: false });
    }
  }
}));

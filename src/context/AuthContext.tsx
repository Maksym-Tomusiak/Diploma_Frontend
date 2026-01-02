"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "@/services/AuthService";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshGoogleToken: () => Promise<string>;
  updateUserGoogleToken: (newToken: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If user is banned, backend will return 403. Clear local token and set user to null.
      // This prevents banned users from using the frontend.
      // Try to detect HTTP response status if available.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error;
      if (err?.response?.status === 403) {
        try {
          if (typeof window !== "undefined") localStorage.removeItem("token");
        } catch {}
      }
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const loginWithGoogle = async () => {
    await authService.loginWithGoogle();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshGoogleToken = async (): Promise<string> => {
    try {
      const newToken = await authService.refreshGoogleToken();
      // Update user object with new token
      if (user) {
        setUser({ ...user, google_access_token: newToken });
      }
      return newToken;
    } catch (error) {
      console.error("Failed to refresh Google token:", error);
      throw error;
    }
  };

  const updateUserGoogleToken = (newToken: string) => {
    if (user) {
      setUser({ ...user, google_access_token: newToken });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
    refreshUser,
    refreshGoogleToken,
    updateUserGoogleToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

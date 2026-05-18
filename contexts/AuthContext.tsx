"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, type IAuthUser } from "@/services/AuthService";

const TOKEN_KEY = "visiona_auth_token";
const USER_KEY = "visiona_auth_user";


function initializeToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function initializeUser(): IAuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as IAuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}


interface AuthContextValue {
  user: IAuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(() => initializeUser());
  const [token, setToken] = useState<string | null>(() => initializeToken());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (email: string, senha: string) => {
      const data = await AuthService.login({ email, senha });

      localStorage.setItem(TOKEN_KEY, data.access_token);
      document.cookie = `${TOKEN_KEY}=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

      localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
      setUser(data.usuario);

      setToken(data.access_token);
      router.replace("/");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

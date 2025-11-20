import { createContext, useContext } from "react";
import type { User } from "../types/auth";

// 1. Define the interface
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Create the Context
export const AuthContext = createContext<AuthContextType | null>(null);

// 3. Export the Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

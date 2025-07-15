import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

export interface User {
  token: string;
  _id: string;
  name: string;
  email: string;
  role: "employer" | "applicant";
  role_id: string
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        console.log(res)
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        console.log(user, "now its")
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    console.log(res)
    localStorage.setItem("token", res.data.token);
    const result = res.data.data
    result.role_id = res.data.role_id
    setUser(result);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

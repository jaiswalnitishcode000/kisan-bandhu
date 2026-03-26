import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "farmer" | "buyer" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const API = "http://127.0.0.1:8000";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("kisan_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("kisan_user", JSON.stringify(user));
    else localStorage.removeItem("kisan_user");
  }, [user]);

  // ✅ Signup - Backend se
  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) return false; // Email already exists

      const data = await res.json();
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  // ✅ Login - Backend se
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
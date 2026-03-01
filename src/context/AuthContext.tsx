import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "farmer" | "buyer" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    // Store users list in localStorage
    const users = JSON.parse(localStorage.getItem("kisan_users") || "[]");
    if (users.find((u: any) => u.email === email)) return false;
    users.push({ name, email, password, role });
    localStorage.setItem("kisan_users", JSON.stringify(users));
    setUser({ name, email, role });
    return true;
  };

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("kisan_users") || "[]");
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      setUser({ name: found.name, email: found.email, role: found.role });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const switchRole = (role: UserRole) => {
    if (user) setUser({ ...user, role });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

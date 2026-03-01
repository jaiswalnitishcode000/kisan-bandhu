import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Menu, X, Leaf, LogOut, User, RefreshCw } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/advisory", label: "Crop Advisory" },
    { to: "/msp-calculator", label: "MSP Calculator" },
    { to: "/schemes", label: "Gov Schemes" },
  ];

  if (user?.role === "farmer") navLinks.push({ to: "/farmer-dashboard", label: "My Dashboard" });
  if (user?.role === "buyer") navLinks.push({ to: "/buyer-dashboard", label: "My Dashboard" });
  if (user?.role === "admin") navLinks.push({ to: "/admin", label: "Admin Panel" });

  const roleOptions: UserRole[] = ["farmer", "buyer"];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Leaf className="w-7 h-7" />
          <span>Kisan Bandhu</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Role Switcher */}
              {user.role !== "admin" && (
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-secondary transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {user.role === "farmer" ? "Farmer" : "Buyer"}
                  </button>
                  {showRoleMenu && (
                    <div className="absolute right-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-1 min-w-[120px] animate-scale-in">
                      {roleOptions.map((r) => (
                        <button
                          key={r}
                          onClick={() => { switchRole(r); setShowRoleMenu(false); }}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                            user.role === r ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" /> {user.name}
              </span>
              <button onClick={logout} className="p-2 rounded-md hover:bg-muted transition-colors text-destructive">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Login / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              {user ? (
                <div className="space-y-2">
                  {user.role !== "admin" && (
                    <div className="flex gap-2">
                      {roleOptions.map((r) => (
                        <button
                          key={r}
                          onClick={() => { switchRole(r); setMobileOpen(false); }}
                          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            user.role === r ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full px-3 py-2.5 rounded-md text-sm font-medium text-destructive bg-muted">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground text-center">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

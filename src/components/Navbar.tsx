import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, Leaf, LogOut, User, RefreshCw } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
 const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/marketplace", label: t("marketplace") },
    { to: "/advisory", label: t("cropAdvisory") },
    { to: "/msp-calculator", label: t("mspCalculator") },
    { to: "/schemes", label: t("govSchemes") },
  ];

  if (user?.role === "farmer") navLinks.push({ to: "/farmer-dashboard", label: t("myDashboard") });
  if (user?.role === "buyer") navLinks.push({ to: "/buyer-dashboard", label: t("myDashboard") });
  if (user?.role === "admin") navLinks.push({ to: "/admin", label: t("adminPanel") });

  const roleOptions: UserRole[] = ["farmer", "buyer"];

  return (
  <nav className="sticky top-0 z-50 shadow-sm" style={{backgroundColor: "#242624", borderBottom: "none", marginBottom: 0}}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl" style={{color: "white"}}>
          <img src="/favicon.ico" alt="wheat" className="w-8 h-8" />
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
    ? "bg-orange-500 text-white"
    : "hover:bg-green-800"
}`}
style={!isActive(link.to) ? { color: "#ffffff" } : {}}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth + language selector */}
        <div className="hidden lg:flex items-center gap-3">
          {/* language selector desktop (always visible) */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="border px-1 rounded"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
          </select>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Role Badge Display */}
              <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary/10 text-primary">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
  style={{backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)"}}>
  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
    style={{backgroundColor: "white", color: "#166534"}}>
    {user.name.charAt(0).toUpperCase()}
  </div>
  <div className="flex flex-col leading-tight">
    <span className="text-xs font-bold text-white">{user.name}</span>
    <span className="text-xs capitalize" style={{color: "rgba(255,255,255,0.7)"}}>{user.role}</span>
  </div>
  <button onClick={logout}
    className="ml-1 p-1 rounded-lg transition-all hover:opacity-80"
    style={{backgroundColor: "rgba(255,255,255,0.15)", color: "white"}}>
    <LogOut className="w-3.5 h-3.5" />
  </button>
</div>
            </div>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
              {t("loginSignup")}
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
                <>
                  <div className="space-y-2">
                    <div className="px-3 py-2.5 rounded-md text-sm font-medium bg-primary/10 text-primary text-center">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full px-3 py-2.5 rounded-md text-sm font-medium text-destructive bg-muted">
                      {t("logout")}
                    </button>
                    {/* language selector mobile */}
                    <select
                      value={lang}
                      onChange={(e) => { setLang(e.target.value as any); setMobileOpen(false); }}
                      className="w-full mt-2 border px-1 rounded"
                    >
                      <option value="en">EN</option>
                      <option value="hi">हिं</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground text-center">
                    {t("loginSignup")}
                  </Link>
                  {/* language selector mobile */}
                  <select
                    value={lang}
                    onChange={(e) => { setLang(e.target.value as any); setMobileOpen(false); }}
                    className="w-full mt-2 border px-1 rounded"
                  >
                    <option value="en">EN</option>
                    <option value="hi">हिं</option>
                  </select>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

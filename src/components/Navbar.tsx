import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, LogOut, User } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#242624" }}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: "white" }}>
          <img src="/favicon.ico" alt="wheat" className="w-8 h-8" />
          <span>Kisan Bandhu</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to) ? "bg-orange-500 text-white" : "hover:bg-green-800"
              }`}
              style={!isActive(link.to) ? { color: "#ffffff" } : {}}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          <select value={lang} onChange={(e) => setLang(e.target.value as any)}
          className="border px-1 rounded text-sm">
          <option value="en">EN</option>
          <option value="hi">हिं</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          </select>

          {user ? (
            <div className="relative" ref={menuRef}>
              {/* ✅ Avatar button - click se dropdown */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "white", color: "#166534" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.7)" }}>{user.role}</span>
                </div>
              </button>

              {/* ✅ Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50 animate-scale-in">
                  <Link to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <hr className="border-border" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth"
              className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
              {t("loginSignup")}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              {user ? (
                <div className="space-y-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-md text-sm font-medium text-destructive bg-muted">
                    {t("logout")}
                  </button>
                  <select value={lang} onChange={(e) => { setLang(e.target.value as any); setMobileOpen(false); }}
                    className="w-full mt-2 border px-1 rounded">
                    <option value="en">EN</option>
                    <option value="hi">हिं</option>
                    <option value="pa">ਪੰਜਾਬੀ</option>
                  </select>
                </div>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground text-center">
                    {t("loginSignup")}
                  </Link>
                  <select value={lang} onChange={(e) => setLang(e.target.value as any)}
                    className="border px-1 rounded text-sm">
                   <option value="en">EN</option>
                   <option value="hi">हिं</option>
                   <option value="pa">ਪੰਜਾਬੀ</option>
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
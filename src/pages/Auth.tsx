import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, Leaf } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) return t("errorEmailPassword");
    if (!isLogin && !name) return t("errorNameRequired");
    if (password.length < 6) return t("errorPasswordLength");
    if (!/\S+@\S+\.\S+/.test(email)) return t("errorInvalidEmail");
    return "";
  };

  // ✅ Async submit - backend se connect
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const ok = await login(email, password);
        if (!ok) { setError(t("errorInvalidCredentials")); return; }
      } else {
        const ok = await signup(name, email, password, role);
        if (!ok) { setError(t("errorAccountExists")); return; }
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; emoji: string }[] = [
    { value: "farmer", label: t("farmerRole"), emoji: "🧑‍🌾" },
    { value: "buyer", label: t("buyerRole"), emoji: "🛒" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card border border-border p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? t("welcomeBack") : t("createAccountHeader")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? t("loginPrompt") : t("joinPrompt")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - signup only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">{t("fullNameLabel")}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder={t("enterFullName")} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">{t("emailLabel")}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder={t("enterYourEmail")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">{t("passwordLabel")}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none pr-12"
                  placeholder={t("enterYourPassword")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection - signup only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">{t("roleLabel")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                        role === r.value
                          ? "bg-primary text-primary-foreground border-primary shadow-kisan"
                          : "bg-background border-input hover:bg-muted"
                      }`}>
                      <span className="text-lg block">{r.emoji}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? "Please wait..." : isLogin ? t("loginButton") : t("createAccountButton")}
            </button>
          </form>

          <div className="text-center mt-5">
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-sm text-primary font-medium hover:underline">
              {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Eye, EyeOff, Leaf } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) return "Email and password are required.";
    if (!isLogin && !name) return "Name is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");

    if (isLogin) {
      const ok = login(email, password);
      if (!ok) { setError("Invalid email or password."); return; }
    } else {
      const ok = signup(name, email, password, role);
      if (!ok) { setError("Account already exists with this email."); return; }
    }
    navigate("/");
  };

  const roles: { value: UserRole; label: string; emoji: string }[] = [
    { value: "farmer", label: "Farmer", emoji: "🧑‍🌾" },
    { value: "buyer", label: "Buyer", emoji: "🛒" },
    { value: "admin", label: "Admin", emoji: "⚙️" },
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
            <h1 className="text-2xl font-bold text-foreground">{isLogin ? "Welcome Back!" : "Create Account"}</h1>
            <p className="text-sm text-muted-foreground mt-1">{isLogin ? "Login to your Kisan Bandhu account" : "Join Kisan Bandhu today"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - signup only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Full Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none pr-12"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection - signup only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">I am a</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                        role === r.value
                          ? "bg-primary text-primary-foreground border-primary shadow-kisan"
                          : "bg-background border-input hover:bg-muted"
                      }`}
                    >
                      <span className="text-lg block">{r.emoji}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-5">
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-sm text-primary font-medium hover:underline">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

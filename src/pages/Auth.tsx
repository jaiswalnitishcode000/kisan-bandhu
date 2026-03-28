import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Eye, EyeOff, Leaf, ArrowRight, ArrowLeft } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh"
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 - Farmer
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [landSize, setLandSize] = useState("");
  const [hasNoLand, setHasNoLand] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  // Step 2 - Buyer
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerCity, setBuyerCity] = useState("");
  const [buyerState, setBuyerState] = useState("");
  const [businessType, setBusinessType] = useState("individual");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const inputClass = "w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none";
  const labelClass = "block text-sm font-medium mb-1 text-foreground";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError(t("errorEmailPassword")); return; }
    setError("");
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (!ok) { setError(t("errorInvalidCredentials")); return; }
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { setError("Name is required"); return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError(t("errorInvalidEmail")); return; }
    if (!password || password.length < 6) { setError(t("errorPasswordLength")); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "farmer") {
      if (!phone || phone.length !== 10) { setError("Valid 10-digit phone required"); return; }
      if (!state) { setError("State is required"); return; }
      if (!district) { setError("District is required"); return; }
      if (!hasNoLand && !landSize) { setError("Land size is required or check 'No Land'"); return; }
    } else {
      if (!buyerPhone || buyerPhone.length !== 10) { setError("Valid 10-digit phone required"); return; }
      if (!buyerCity) { setError("City is required"); return; }
      if (!buyerState) { setError("State is required"); return; }
      if (businessType !== "individual" && !companyName) { setError("Company name is required"); return; }
    }
    setError("");
    setLoading(true);

    const profileData = role === "farmer" ? {
      phone, state, district,
      land_size: hasNoLand ? "0" : landSize,
      has_land: !hasNoLand,
      aadhaar: aadhaar || null,
      bank_account: bankAccount || null,
      bank_ifsc: bankIfsc || null,
    } : {
      phone: buyerPhone,
      city: buyerCity,
      state: buyerState,
      business_type: businessType,
      company_name: businessType !== "individual" ? companyName : null,
      gst_number: gstNumber || null,
    };

    try {
      const ok = await signup(name, email, password, role, profileData);
      if (!ok) { setError(t("errorAccountExists")); return; }
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
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-2xl shadow-card border border-border p-8 animate-scale-in">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? t("welcomeBack") : step === 1 ? t("createAccountHeader") : role === "farmer" ? "🧑‍🌾 Farmer Profile" : "🛒 Buyer Profile"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? t("loginPrompt") : step === 1 ? t("joinPrompt") : "Tell us more about yourself"}
            </p>
            {!isLogin && (
              <div className="flex justify-center gap-2 mt-3">
                <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-muted"}`}/>
                <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-muted"}`}/>
              </div>
            )}
          </div>

          {/* LOGIN */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelClass}>{t("emailLabel")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputClass} placeholder={t("enterYourEmail")} />
              </div>
              <div>
                <label className={labelClass}>{t("passwordLabel")}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`} placeholder={t("enterYourPassword")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-60">
                {loading ? "Please wait..." : t("loginButton")}
              </button>
            </form>
          )}

          {/* SIGNUP STEP 1 */}
          {!isLogin && step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className={labelClass}>{t("fullNameLabel")}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className={inputClass} placeholder={t("enterFullName")} />
              </div>
              <div>
                <label className={labelClass}>{t("emailLabel")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputClass} placeholder={t("enterYourEmail")} />
              </div>
              <div>
                <label className={labelClass}>{t("passwordLabel")}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`} placeholder={t("enterYourPassword")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={`${labelClass} mb-2`}>{t("roleLabel")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                        role === r.value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
                      }`}>
                      <span className="text-lg block">{r.emoji}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              <button type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center justify-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGNUP STEP 2 - FARMER */}
          {!isLogin && step === 2 && role === "farmer" && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className={labelClass}>📱 Phone Number *</label>
                <input type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={inputClass} placeholder="10-digit mobile number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>🗺️ State *</label>
                  <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>📍 District *</label>
                  <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)}
                    className={inputClass} placeholder="Your district" />
                </div>
              </div>
              <div>
                <label className={labelClass}>🌾 Land Size (Acres)</label>
                <div className="flex gap-3 items-center">
                  <input type="number" value={landSize} onChange={(e) => setLandSize(e.target.value)}
                    disabled={hasNoLand} className={`${inputClass} flex-1 disabled:opacity-50`} placeholder="Acres" />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap cursor-pointer">
                    <input type="checkbox" checked={hasNoLand}
                      onChange={(e) => { setHasNoLand(e.target.checked); setLandSize(""); }}
                      className="w-4 h-4 accent-primary" />
                    No Land
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>🪪 Aadhaar <span className="text-muted-foreground font-normal">(Optional)</span></label>
                <input type="text" value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className={inputClass} placeholder="12-digit Aadhaar number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>🏦 Bank Account <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)}
                    className={inputClass} placeholder="Account number" />
                </div>
                <div>
                  <label className={labelClass}>IFSC <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input type="text" value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    className={inputClass} placeholder="IFSC code" />
                </div>
              </div>
              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(""); }}
                  className="px-4 py-3 rounded-xl bg-muted text-muted-foreground font-medium flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-60">
                  {loading ? "Creating account..." : t("createAccountButton")}
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP STEP 2 - BUYER */}
          {!isLogin && step === 2 && role === "buyer" && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className={labelClass}>📱 Phone Number *</label>
                <input type="tel" value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={inputClass} placeholder="10-digit mobile number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>🏙️ City *</label>
                  <input type="text" value={buyerCity} onChange={(e) => setBuyerCity(e.target.value)}
                    className={inputClass} placeholder="Your city" />
                </div>
                <div>
                  <label className={labelClass}>🗺️ State *</label>
                  <select value={buyerState} onChange={(e) => setBuyerState(e.target.value)} className={inputClass}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>💼 I am a *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "individual", label: "Individual", emoji: "👤" },
                    { value: "wholesaler", label: "Wholesaler", emoji: "🏭" },
                    { value: "retailer", label: "Retailer", emoji: "🏪" },
                  ].map((bt) => (
                    <button key={bt.value} type="button" onClick={() => setBusinessType(bt.value)}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        businessType === bt.value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
                      }`}>
                      <span className="text-base block mb-0.5">{bt.emoji}</span>
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>
              {businessType !== "individual" && (
                <div>
                  <label className={labelClass}>🏢 Company/Business Name *</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClass} placeholder="Your business name" />
                </div>
              )}
              <div>
                <label className={labelClass}>📄 GST Number <span className="text-muted-foreground font-normal">(Optional)</span></label>
                <input type="text" value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className={inputClass} placeholder="15-digit GST number" />
              </div>
              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(""); }}
                  className="px-4 py-3 rounded-xl bg-muted text-muted-foreground font-medium flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-60">
                  {loading ? "Creating account..." : t("createAccountButton")}
                </button>
              </div>
            </form>
          )}

          <div className="text-center mt-5">
            <button onClick={() => { setIsLogin(!isLogin); setError(""); setStep(1); }}
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
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { ShoppingCart, Sprout, Landmark, Users, ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEMO_USERS = [
  { type: "farmer", name: "Ramesh Kumar", city: "Amritsar", lat: 31.634, lng: 74.872, crop: "Wheat" },
  { type: "farmer", name: "Suresh Patel", city: "Ahmedabad", lat: 23.022, lng: 72.571, crop: "Cotton" },
  { type: "farmer", name: "Mohan Lal", city: "Jaipur", lat: 26.912, lng: 75.787, crop: "Bajra" },
  { type: "farmer", name: "Nitish Jaiswal", city: "Patna", lat: 25.594, lng: 85.137, crop: "Rice" },
  { type: "farmer", name: "Arvind Singh", city: "Lucknow", lat: 26.846, lng: 80.946, crop: "Sugarcane" },
  { type: "farmer", name: "Priya Sharma", city: "Bhopal", lat: 23.259, lng: 77.412, crop: "Soybean" },
  { type: "farmer", name: "Dinesh Yadav", city: "Nagpur", lat: 21.145, lng: 79.088, crop: "Orange" },
  { type: "farmer", name: "Lakshmi Bai", city: "Hyderabad", lat: 17.385, lng: 78.486, crop: "Maize" },
  { type: "farmer", name: "Ravi Verma", city: "Chennai", lat: 13.082, lng: 80.270, crop: "Paddy" },
  { type: "farmer", name: "Gopal Das", city: "Kolkata", lat: 22.572, lng: 88.363, crop: "Jute" },
  { type: "buyer", name: "Agromart Pvt Ltd", city: "Mumbai", lat: 19.076, lng: 72.877, crop: "All Crops" },
  { type: "buyer", name: "FreshDeal Co.", city: "Delhi", lat: 28.613, lng: 77.209, crop: "Vegetables" },
  { type: "buyer", name: "GrainTrade India", city: "Chandigarh", lat: 30.733, lng: 76.779, crop: "Wheat" },
  { type: "buyer", name: "SouthAgro Ltd", city: "Bangalore", lat: 12.971, lng: 77.594, crop: "Millets" },
  { type: "buyer", name: "EastHarvest Inc", city: "Bhubaneswar", lat: 20.296, lng: 85.824, crop: "Rice" },
  { type: "farmer", name: "Shashank Mishra", city: "Prayagraj", lat: 25.4358, lng: 81.8463, crop: "Wheat" },
{ type: "buyer", name: "Avika Garg", city: "Rohtak", lat: 28.8955, lng: 76.6066, crop: "Wheat" },
];

// ✅ Replace karo sirf IndiaMap component aur useEffect in Index.tsx

// 1. Top pe yeh import add karo (already hai toh skip):
// import { useEffect, useState, useRef } from "react";

// 2. DEMO_USERS ke baad yeh add karo:
const API = "https://kisan-bandhu-production.up.railway.app";

// 3. IndiaMap component ko yeh se replace karo:
const IndiaMap = () => {
  const [realFarmers, setRealFarmers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/farmers/map`)
      .then(res => res.json())
      .then(data => setRealFarmers(data))
      .catch(() => console.log("Map data fetch failed"));
  }, []);

  // DEMO_USERS + real farmers merge karo
  const allUsers = [
    ...DEMO_USERS,
    ...realFarmers.filter(rf =>
      // Duplicate avoid karo - same city nahi honi chahiye
      !DEMO_USERS.some(d => d.name === rf.name)
    )
  ];

  return (
    <MapContainer
      center={[22.5, 82.0]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {allUsers.map((user, i) => (
        <CircleMarker
          key={i}
          center={[user.lat, user.lng]}
          radius={user.type === "farmer" ? 8 : 10}
          pathOptions={{
            color: user.type === "farmer" ? "#166534" : "#f59e0b",
            fillColor: user.type === "farmer" ? "#166534" : "#f59e0b",
            fillOpacity: 0.85,
          }}
        >
          <Popup>
            <div style={{fontSize: "13px"}}>
              <p style={{fontWeight: "bold"}}>{user.type === "farmer" ? "🧑‍🌾" : "🏭"} {user.name}</p>
              <p>📍 {user.city}</p>
              <p>🌾 {user.crop}</p>
              <p style={{color: user.type === "farmer" ? "#166534" : "#f59e0b", fontWeight: "600", textTransform: "capitalize"}}>
                {user.type}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

const STEPS = [
  { label: "Farmer",        row: 0, col: 0, color: "#166534", bg: "#f0fdf4", border: "#86efac", icon: "👨‍🌾" },
  { label: "Register",      row: 0, col: 1, color: "#0369a1", bg: "#f0f9ff", border: "#7dd3fc", icon: "📋" },
  { label: "List Crop",     row: 0, col: 2, color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd", icon: "🌿" },
  { label: "Buyers Bid",    row: 0, col: 3, color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: "💼" },
  { label: "Negotiation",   row: 0, col: 4, color: "#be123c", bg: "#fff1f2", border: "#fda4af", icon: "🤝" },
  { label: "Deal Confirm",  row: 0, col: 5, color: "#0f766e", bg: "#f0fdfa", border: "#5eead4", icon: "✔️" },
  { label: "Packaging",     row: 1, col: 5, color: "#166534", bg: "#f0fdf4", border: "#86efac", icon: "📦" },
  { label: "Dispatch",      row: 1, col: 4, color: "#0369a1", bg: "#f0f9ff", border: "#7dd3fc", icon: "🏭" },
  { label: "Quality Check", row: 1, col: 3, color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd", icon: "🔬" },
  { label: "Delivery",      row: 1, col: 2, color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: "🚛" },
  { label: "Payment",       row: 1, col: 1, color: "#be123c", bg: "#fff1f2", border: "#fda4af", icon: "💳" },
  { label: "Final Payment", row: 2, col: 0, color: "#0f766e", bg: "#f0fdfa", border: "#5eead4", icon: "💰" },
  { label: "Buyer",         row: 2, col: 1, color: "#166534", bg: "#f0fdf4", border: "#86efac", icon: "🏪" },
];

const TradingFlow = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveStep(-1);
    let step = 0;
    intervalRef.current = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= STEPS.length) {
        clearInterval(intervalRef.current!);
        timeoutRef.current = setTimeout(() => startAnimation(), 1500);
      }
    }, 600);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const row0 = STEPS.filter(s => s.row === 0).sort((a, b) => a.col - b.col);
  const row1 = STEPS.filter(s => s.row === 1).sort((a, b) => b.col - a.col);
  const row2 = STEPS.filter(s => s.row === 2).sort((a, b) => a.col - b.col);
  const stepIndex = (s: typeof STEPS[0]) => STEPS.findIndex(x => x.label === s.label);

  const StepCircle = ({ item }: { item: typeof STEPS[0] }) => {
    const idx = stepIndex(item);
    const isActive = activeStep === idx;
    const isDone = activeStep > idx;

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 relative"
          style={{
            backgroundColor: isActive || isDone ? item.bg : "#f8fafc",
            border: `2px solid ${isActive ? item.color : isDone ? item.border : "#e2e8f0"}`,
            transform: isActive ? "scale(1.25)" : isDone ? "scale(1.05)" : "scale(1)",
            boxShadow: isActive
              ? `0 0 20px ${item.border}, 0 4px 15px rgba(0,0,0,0.1)`
              : isDone
              ? "0 2px 8px rgba(0,0,0,0.08)"
              : "none",
            filter: !isDone && !isActive ? "grayscale(1) opacity(0.35)" : "none",
          }}
        >
          {item.icon}
          {isActive && (
            <div className="absolute inset-0 rounded-2xl animate-ping"
              style={{border: `2px solid ${item.color}`, opacity: 0.4}}/>
          )}
        </div>
        <p
          className="text-xs font-bold uppercase tracking-wide text-center w-20 transition-all duration-300"
          style={{
            color: isActive ? item.color : isDone ? "#374151" : "#cbd5e1",
          }}
        >
          {item.label}
        </p>
      </div>
    );
  };

  const Dash = ({ done }: { done: boolean }) => (
    <svg width="36" height="12" className="mb-8 mx-1 flex-shrink-0">
      <line
        x1="0" y1="6" x2="36" y2="6"
        stroke={done ? "#166534" : "#e2e8f0"}
        strokeWidth="2.5"
        strokeDasharray="5,3"
        style={{transition: "stroke 0.4s"}}
      />
    </svg>
  );

  return (
    <div ref={sectionRef}>
      {/* Row 1 */}
      <div className="flex items-start justify-between flex-nowrap">
        {row0.map((item, i) => (
          <div key={item.label} className="flex items-center">
            <StepCircle item={item} />
            {i < row0.length - 1 && <Dash done={activeStep > stepIndex(item)} />}
          </div>
        ))}
        {/* Right curve */}
        <div style={{
          width: "28px",
          height: "86px",
          borderRight: `2.5px dashed ${activeStep >= 5 ? "#166534" : "#e2e8f0"}`,
          borderBottom: `2.5px dashed ${activeStep >= 5 ? "#166534" : "#e2e8f0"}`,
          borderRadius: "0 0 16px 0",
          marginTop: "28px",
          marginLeft: "-4px",
          marginBottom: "-54px",
          transition: "border-color 0.4s",
          flexShrink: 0,
        }}/>
      </div>

      {/* Row 2 */}
      <div className="flex items-start flex-row-reverse justify-between flex-nowrap mt-10">
        {row1.map((item, i) => (
          <div key={item.label} className="flex items-center flex-row-reverse">
            <StepCircle item={item} />
            {i < row1.length - 1 && <Dash done={activeStep > stepIndex(item)} />}
          </div>
        ))}
        {/* Left curve */}
        <div style={{
          width: "28px",
          height: "86px",
          borderLeft: `2.5px dashed ${activeStep >= 11 ? "#166534" : "#e2e8f0"}`,
          borderBottom: `2.5px dashed ${activeStep >= 11 ? "#166534" : "#e2e8f0"}`,
          borderRadius: "0 0 0 16px",
          marginTop: "28px",
          marginRight: "-4px",
          marginBottom: "-54px",
          transition: "border-color 0.4s",
          flexShrink: 0,
        }}/>
      </div>

      {/* Row 3 */}
      <div className="flex items-start gap-2 mt-10">
        {row2.map((item, i) => (
          <div key={item.label} className="flex items-center">
            <StepCircle item={item} />
            {i < row2.length - 1 && <Dash done={activeStep > stepIndex(item)} />}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>👨‍🌾 Farmer</span>
          <span style={{color: "#166534", fontWeight: "600"}}>
            {activeStep >= 0 ? `Step ${activeStep + 1} of ${STEPS.length}` : "Starting..."}
          </span>
          <span>🏪 Buyer</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${activeStep >= 0 ? ((activeStep + 1) / STEPS.length) * 100 : 0}%`,
              background: "linear-gradient(90deg, #166534, #16a34a, #f59e0b)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
     {/* Hero Section */}
<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80)` }} />
  <div className="absolute inset-0" style={{background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)"}} />

  <div className="relative z-10 container mx-auto px-4 text-center">

    {/* Title */}
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 animate-fade-in leading-tight"
      style={{animationDelay: "0.1s", textShadow: "0 4px 20px rgba(0,0,0,0.3)"}}>
      {t("heroTitle")}
    </h1>

    {/* Subtitle */}
    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in"
      style={{animationDelay: "0.2s"}}>
      {t("heroSubtitle")}
    </p>

    {/* 4 Buttons */}
    <div className="flex flex-wrap justify-center gap-4 animate-fade-in mb-12"
      style={{animationDelay: "0.3s"}}>
      <Link to="/marketplace"
  className="px-6 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl"
  style={{backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(10px)"}}>
  <ShoppingCart className="w-5 h-5" /> {t("exploreMarketplace")}
</Link>
      <Link to="/advisory"
        className="px-6 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl"
        style={{backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(10px)"}}>
        <Sprout className="w-5 h-5" /> {t("cropAdvisory")}
      </Link>
      <Link to="/schemes"
        className="px-6 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl"
        style={{backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(10px)"}}>
        <Landmark className="w-5 h-5" /> {t("govSchemes")}
      </Link>
      <Link to="/market-insights"
        className="px-6 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl"
        style={{backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(10px)"}}>
        <TrendingUp className="w-5 h-5" /> {t("marketInsights")}
      </Link>
    </div>

    {/* Join Now CTA */}
    <div className="animate-fade-in" style={{animationDelay: "0.4s"}}>
      <Link to="/auth"
  className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-extrabold text-lg transition-all hover:scale-105 hover:shadow-2xl"
  style={{
    background: "linear-gradient(135deg, #166534, #16a34a)",
    color: "white",
    boxShadow: "0 8px 30px rgba(22,101,52,0.5)",
  }}>
  {t("joinNow")} <ArrowRight className="w-5 h-5" />
</Link>
    </div>

  </div>
</section>

     {/* About Section */}
<section className="py-20 bg-background overflow-hidden">
  <div className="container mx-auto px-4">
    
    {/* Top heading */}
    <ScrollReveal>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-4">
  {t("aboutTitle")}
</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
  {t("aboutSubtitle")}
</p>
      </div>
    </ScrollReveal>

    {/* 2 column layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
      
      {/* Left - Image/Visual */}
      <ScrollReveal>
        <div className="relative">
          {/* Main card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl" style={{height: "380px"}}>
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              alt="Farmer in wheat field"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 rounded-3xl" 
              style={{background: "linear-gradient(to top, rgba(22,101,52,0.7) 0%, transparent 60%)"}} />
          </div>

        </div>
      </ScrollReveal>

      {/* Right - Content */}
      <ScrollReveal>
        <div className="space-y-6">
          
          {/* Mission */}
          <div className="flex gap-4 items-start p-5 rounded-2xl transition-all hover:shadow-md"
            style={{backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{backgroundColor: "#166534"}}>
              🎯
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">{t("missionTitle")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
  {t("missionText")}
</p>
            </div>
          </div>

          {/* Vision */}
          <div className="flex gap-4 items-start p-5 rounded-2xl transition-all hover:shadow-md"
            style={{backgroundColor: "#fff7ed", border: "1px solid #fed7aa"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{backgroundColor: "#f59e0b"}}>
              🌟
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">{t("visionTitle")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
  {t("visionText")}
</p>
            </div>
          </div>

          {/* Why Us */}
          <div className="flex gap-4 items-start p-5 rounded-2xl transition-all hover:shadow-md"
            style={{backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{backgroundColor: "#166534"}}>
              💡
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">{t("whyTitle")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
  {t("whyText")}
</p>
            </div>
          </div>

        </div>
      </ScrollReveal>
    </div>
  </div>
</section>


      {/* Services Section */}
<section className="py-20 bg-background overflow-hidden">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-4">
  {t("servicesTitle")}
</h2>
<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
  {t("servicesSubtitle")}
</p>
      </div>
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {[
  {
    emoji: "🛒",
    title: t("serviceMarketplaceTitle"),
    desc: t("serviceMarketplaceDesc"),
    color: "#166534",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    link: "/marketplace",
  },
  {
    emoji: "🌱",
    title: t("serviceAdvisoryTitle"),
    desc: t("serviceAdvisoryDesc"),
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    link: "/advisory",
  },
  {
    emoji: "🏛️",
    title: t("serviceSchemesTitle"), 
    desc: t("serviceSchemesDesc"),
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    link: "/schemes",
  },
  {
    emoji: "🧮",
   title: t("serviceMspTitle"),
   desc: t("serviceMspDesc"),
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    link: "/msp-calculator",
  },
  {
    emoji: "💰",
    title: t("serviceSubsidyTitle"),
    desc: t("serviceSubsidyDesc"),
    color: "#166534",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    link: "/msp-calculator",
  },
  {
    emoji: "📊",
   title: t("serviceInsightsTitle"),
   desc: t("serviceInsightsDesc"),
    color: "#be123c",
    bg: "#fff1f2",
    border: "#fecdd3",
    link: "/market-insights",
  },
].map((service, i) => (
        <ScrollReveal key={i}>
          <div
            className="group rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full"
            style={{
              backgroundColor: service.bg,
              borderColor: service.border,
            }}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm transition-transform duration-300 group-hover:scale-110"
              style={{backgroundColor: service.color}}
            >
              {service.emoji}
            </div>

            {/* Content */}
            <h3
              className="text-lg font-bold mb-2"
              style={{color: service.color}}
            >
              {service.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {service.desc}
            </p>

            {/* Arrow link */}
            <Link
              to={service.link}
              className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
              style={{color: service.color}}
            >
              {t("learnMore")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      ))}
    </div>


  </div>
</section>

      {/* Trading Flow Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
  {t("valueTitle")}
</h2>

<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
  {t("valueSubtitle")}
</p>
            </div>
          </ScrollReveal>
          <TradingFlow />
        </div>
      </section>

      {/* India Map Section */}
<section className="py-16 bg-muted/50">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
  {t("networkTitle")}
</h2>

<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
  {t("networkSubtitle")}
</p>
      </div>
    </ScrollReveal>

    {/* Legend */}
    <div className="flex justify-center gap-8 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#166534"}}></div>
        <span className="text-sm font-medium text-foreground">🧑‍🌾 {t("farmerLabel")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#f59e0b"}}></div>
        <span className="text-sm font-medium text-foreground">🏭 {t("buyerLabel")}</span>
      </div>
    </div>

    <div className="rounded-2xl overflow-hidden shadow-lg border border-border" style={{height: "500px"}}>
      <IndiaMap />
    </div>

    {/* Stats below map */}
    <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg mx-auto text-center">
      {[
        { value: "18", label: t("statesCovered") },
        { value: "24", label: t("farmersCount") },
        { value: "16", label: t("buyersCount") },
      ].map((s, i) => (
        <div key={i} className="bg-card rounded-xl p-4 border border-border">
          <div className="text-2xl font-extrabold" style={{color: "#166534"}}>{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

     {/* Key Features Section */}
<section className="py-16 bg-background">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold text-foreground">
  {t("featuresTitle")}
</h2>
<p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
  {t("featuresSubtitle")}
</p>
      </div>
    </ScrollReveal>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {[
  {
    emoji: "🔍",
    title: t("featureTransparencyTitle"),
    desc: t("featureTransparencyDesc"),
    highlight: false,
  },
  {
    emoji: "⚖️",
    title: t("featureFairTradeTitle"),
    desc: t("featureFairTradeDesc"),
    highlight: false,
  },
  {
    emoji: "📱",
    title: t("featureUserFriendlyTitle"),
    desc: t("featureUserFriendlyDesc"),
    highlight: false,
  },
  {
    emoji: "🔗",
    title: t("featureTraceabilityTitle"),
    desc: t("featureTraceabilityDesc"),
    highlight: true,
  },
].map((feature, i) => (
        <ScrollReveal key={i}>
          <div
            className="rounded-2xl p-8 text-center border transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: feature.highlight ? "#f0fdf4" : "#ffffff",
              borderColor: feature.highlight ? "#166534" : "#e5e7eb",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-md"
              style={{ backgroundColor: "#166534" }}
            >
              {feature.emoji}
            </div>
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-3"
              style={{ color: feature.highlight ? "#166534" : "#1f2937" }}
            >
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>

      {/* CTA */}
      {!user && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-4 text-foreground">{t("readyToGetStarted")}</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
  {t("ctaDescription")}
</p>
              <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
                {t("joinKisanBandhu")} <ArrowRight className="w-5 h-5" />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;

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
  { type: "farmer", name: "Kiran Devi", city: "Patna", lat: 25.594, lng: 85.137, crop: "Rice" },
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

const IndiaMap = () => {
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
      {DEMO_USERS.map((user, i) => (
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
  { emoji: "🧑‍🌾", label: "Farmer",        row: 0, col: 0, highlight: true  },
  { emoji: "📝",    label: "Register",      row: 0, col: 1, highlight: false },
  { emoji: "🌾",    label: "List Crop",     row: 0, col: 2, highlight: false },
  { emoji: "📢",    label: "Buyers Bid",    row: 0, col: 3, highlight: false },
  { emoji: "🤝",    label: "Negotiation",   row: 0, col: 4, highlight: false },
  { emoji: "✅",    label: "Deal Confirm",  row: 0, col: 5, highlight: false },
  { emoji: "🏷️",   label: "Packaging",     row: 1, col: 5, highlight: false },
  { emoji: "📦",    label: "Dispatch",      row: 1, col: 4, highlight: false },
  { emoji: "🔍",    label: "Quality Check", row: 1, col: 3, highlight: false },
  { emoji: "🚚",    label: "Delivery",      row: 1, col: 2, highlight: false },
  { emoji: "💳",    label: "Payment",       row: 1, col: 1, highlight: false },
  { emoji: "💰",    label: "Final Payment", row: 2, col: 0, highlight: false },
  { emoji: "🏭",    label: "Buyer",         row: 2, col: 1, highlight: true  },
];

const TradingFlow = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting && !isPlaying) {
          startAnimation(); 
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isPlaying, completed]);

  const startAnimation = () => {
    setActiveStep(-1);
    setCompleted(false);
    setIsPlaying(true);
    let step = 0;
    intervalRef.current = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= STEPS.length) {
        clearInterval(intervalRef.current!);
        setIsPlaying(false);
        setCompleted(true);
      }
    }, 600);
  };

  const replay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAnimation();
  };

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
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md transition-all duration-500"
          style={{
            backgroundColor: isActive ? "#f59e0b" : isDone ? "#166534" : item.highlight ? "#166534" : "#1f2937",
            border: isActive ? "3px solid #fde68a" : isDone ? "3px solid #bbf7d0" : item.highlight ? "3px solid #bbf7d0" : "none",
            transform: isActive ? "scale(1.25)" : "scale(1)",
            boxShadow: isActive ? "0 0 20px rgba(245,158,11,0.7)" : isDone ? "0 0 10px rgba(22,101,52,0.4)" : undefined,
          }}
        >
          {item.emoji}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-center w-16 transition-colors duration-300"
          style={{ color: isActive ? "#f59e0b" : isDone || item.highlight ? "#166534" : undefined }}>
          {item.label}
        </p>
      </div>
    );
  };

  const Dash = ({ done }: { done: boolean }) => (
    <svg width="36" height="10" className="mb-6 mx-1 flex-shrink-0">
      <line x1="0" y1="5" x2="36" y2="5"
        stroke={done ? "#166534" : "#9ca3af"}
        strokeWidth="2" strokeDasharray="5,3"
        style={{ transition: "stroke 0.4s" }} />
    </svg>
  );

  return (
    <div ref={sectionRef}>
      <div className="max-w-5xl mx-auto overflow-x-auto pb-4">

        {/* Row 1 - Left to Right */}
        <div className="flex items-start justify-between min-w-[700px]">
          {row0.map((item, i) => (
            <div key={item.label} className="flex items-center">
              <StepCircle item={item} />
              {i < row0.length - 1 && <Dash done={activeStep > stepIndex(item)} />}
            </div>
          ))}
          <div style={{
            width: "28px", height: "88px",
            borderRight: "2px dashed #166534",
            borderBottom: "2px dashed #166534",
            borderRadius: "0 0 16px 0",
            opacity: activeStep >= 5 ? 0.8 : 0.25,
            marginTop: "26px", marginLeft: "-4px", marginBottom: "-56px",
            transition: "opacity 0.4s", flexShrink: 0,
          }} />
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex items-start flex-row-reverse justify-between mt-10 min-w-[700px]">
          {row1.map((item, i) => (
            <div key={item.label} className="flex items-center flex-row-reverse">
              <StepCircle item={item} />
              {i < row1.length - 1 && <Dash done={activeStep > stepIndex(item)} />}
            </div>
          ))}
          <div style={{
            width: "28px", height: "88px",
            borderLeft: "2px dashed #166534",
            borderBottom: "2px dashed #166534",
            borderRadius: "0 0 0 16px",
            opacity: activeStep >= 10 ? 0.8 : 0.25,
            marginTop: "26px", marginRight: "-4px", marginBottom: "-56px",
            transition: "opacity 0.4s", flexShrink: 0,
          }} />
        </div>

        {/* Row 3 - Final */}
        <div className="flex items-start gap-2 mt-10 min-w-[700px]">
          {row2.map((item, i) => (
            <div key={item.label} className="flex items-center">
              <StepCircle item={item} />
              {i < row2.length - 1 && <Dash done={activeStep > stepIndex(item)} />}
            </div>
          ))}
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
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=1920&q=80)` }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-4 animate-fade-in leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/marketplace" className="px-6 py-3 rounded-xl bg-primary-foreground text-primary font-semibold text-base hover:scale-105 transition-transform flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> {t("exploreMarketplace")}
            </Link>
            <Link to="/advisory" className="px-6 py-3 rounded-xl border-2 border-primary-foreground text-primary-foreground font-semibold text-base hover:bg-primary-foreground/10 transition-colors flex items-center gap-2">
              <Sprout className="w-5 h-5" /> {t("cropAdvisory")}
            </Link>
            <Link to="/schemes" className="px-6 py-3 rounded-xl border-2 border-primary-foreground text-primary-foreground font-semibold text-base hover:bg-primary-foreground/10 transition-colors flex items-center gap-2">
              <Landmark className="w-5 h-5" /> {t("govSchemes")}
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
          About <span style={{color: "#166534"}}>Kisan Bandhu</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          India's farmer-first digital marketplace — eliminating middlemen, ensuring fair prices, and empowering every kisan.
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
              <h3 className="font-bold text-lg text-foreground mb-1">Our Mission</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To eliminate middlemen and give farmers direct access to buyers — ensuring maximum profit stays with the farmer.
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
              <h3 className="font-bold text-lg text-foreground mb-1">Our Vision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A digital India where every farmer gets a fair price, transparent trade, and access to government schemes — all in one place.
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
              <h3 className="font-bold text-lg text-foreground mb-1">Why Kisan Bandhu?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Transparent bidding, crop advisory, MSP calculator, and government schemes — everything a farmer needs, in one platform.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Link to="/marketplace" 
              className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{backgroundColor: "#166534", color: "white"}}>
              <ShoppingCart className="w-4 h-4" /> Explore Marketplace
            </Link>
            <Link to="/auth"
              className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{backgroundColor: "#f59e0b", color: "white"}}>
              Join Now <ArrowRight className="w-4 h-4" />
            </Link>
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
        <span className="text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
          style={{backgroundColor: "#f0fdf4", color: "#166534"}}>
          What We Offer
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-4">
          Our <span style={{color: "#166534"}}>Services</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything a farmer and buyer needs — in one powerful platform.
        </p>
      </div>
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {[
        {
          emoji: "🛒",
          title: "Crop Marketplace",
          desc: "List your crops and get the best bids from verified buyers across India. No middlemen, maximum profit.",
          color: "#166534",
          bg: "#f0fdf4",
          border: "#bbf7d0",
          link: "/marketplace",
        },
        {
          emoji: "🌱",
          title: "Crop Advisory",
          desc: "Get expert advice on crop selection, pest control, weather alerts and best farming practices.",
          color: "#0369a1",
          bg: "#f0f9ff",
          border: "#bae6fd",
          link: "/advisory",
        },
        {
          emoji: "🏛️",
          title: "Gov Schemes",
          desc: "Discover and apply for government schemes, subsidies and loans designed for Indian farmers.",
          color: "#7c3aed",
          bg: "#faf5ff",
          border: "#ddd6fe",
          link: "/schemes",
        },
        {
          emoji: "🧮",
          title: "MSP Calculator",
          desc: "Calculate Minimum Support Price for your crops instantly. Know your rights, get fair value.",
          color: "#b45309",
          bg: "#fffbeb",
          border: "#fde68a",
          link: "/msp-calculator",
        },
        {
          emoji: "🤝",
          title: "Direct Farmer-Buyer Connect",
          desc: "Connect directly with verified buyers. Transparent bidding, secure deals, better relationships.",
          color: "#166534",
          bg: "#f0fdf4",
          border: "#bbf7d0",
          link: "/marketplace",
        },
        {
          emoji: "📊",
          title: "Market Insights",
          desc: "Real-time crop prices, market trends and demand forecasts to help you make smarter decisions.",
          color: "#be123c",
          bg: "#fff1f2",
          border: "#fecdd3",
          link: "/",
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
              Learn More <ArrowRight className="w-4 h-4" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our <span style={{color: "#166534"}}>Value</span> Proposition
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Kisan Bandhu connects farmers directly with buyers — eliminating middlemen, ensuring fair prices and transparent trade.
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
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Our <span style={{color: "#166534"}}>Network</span> Across India
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Farmers and buyers connected across the country — from Kashmir to Kanyakumari.
        </p>
      </div>
    </ScrollReveal>

    {/* Legend */}
    <div className="flex justify-center gap-8 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#166534"}}></div>
        <span className="text-sm font-medium text-foreground">🧑‍🌾 Farmer</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#f59e0b"}}></div>
        <span className="text-sm font-medium text-foreground">🏭 Buyer</span>
      </div>
    </div>

    <div className="rounded-2xl overflow-hidden shadow-lg border border-border" style={{height: "500px"}}>
      <IndiaMap />
    </div>

    {/* Stats below map */}
    <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg mx-auto text-center">
      {[
        { value: "18", label: "States Covered" },
        { value: "24", label: "Farmers" },
        { value: "16", label: "Buyers" },
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
          Key <span style={{color: "#166534"}}>Features</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Discover how Kisan Bandhu can benefit farmers, buyers and all agricultural supply chain actors.
        </p>
      </div>
    </ScrollReveal>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {[
        {
          emoji: "🔍",
          title: "Transparency",
          desc: "Direct transactions between farmers and buyers. No hidden charges, no middlemen.",
          highlight: false,
        },
        {
          emoji: "⚖️",
          title: "Fair Trade",
          desc: "Redistribution of value in the agricultural supply chain. Fair prices for all.",
          highlight: false,
        },
        {
          emoji: "📱",
          title: "User Friendly",
          desc: "Easy to use platform for farmers and buyers. Simple, fast and reliable.",
          highlight: false,
        },
        {
          emoji: "🔗",
          title: "Crop Traceability",
          desc: "Track your crop through the entire supply chain. Coming soon!",
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
  Get the best price for your crops. Connect directly with buyers across India. No middlemen — more profit in your hands.
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
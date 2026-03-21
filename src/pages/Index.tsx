import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { ShoppingCart, Sprout, Landmark, Users, ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";

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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("aboutTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("aboutDescription")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our <span style={{color: "#166534"}}>Services</span>
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Kisan Bandhu provides all of the following services to empower farmers across India.
              </p>
            </div>
          </ScrollReveal>
          <div className="relative flex items-center justify-center" style={{height: "480px", maxWidth: "700px", margin: "0 auto"}}>
            <svg className="absolute inset-0 w-full h-full" style={{zIndex: 0}}>
              <line x1="50%" y1="50%" x2="22%" y2="22%" stroke="#166534" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4"/>
              <line x1="50%" y1="50%" x2="78%" y2="22%" stroke="#166534" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4"/>
              <line x1="50%" y1="50%" x2="22%" y2="78%" stroke="#166534" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4"/>
              <line x1="50%" y1="50%" x2="78%" y2="78%" stroke="#166534" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4"/>
              <line x1="50%" y1="50%" x2="50%" y2="88%" stroke="#166534" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4"/>
            </svg>
            <div className="absolute z-10 w-28 h-28 rounded-full border-2 flex items-center justify-center bg-white shadow-lg"
              style={{borderColor: "#166534", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
              <div className="text-center">
                <img src="/favicon.ico" alt="logo" className="w-10 h-10 mx-auto" />
                <p className="text-xs font-bold mt-1" style={{color: "#166534"}}>KISAN<br/>BANDHU</p>
              </div>
            </div>
            <div className="absolute z-10 flex flex-col items-center gap-2" style={{top: "8%", left: "12%"}}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1.5px solid #166534"}}>
                <ShoppingCart className="w-6 h-6" style={{color: "#166534"}} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-center text-foreground">Crop<br/>Marketplace</p>
            </div>
            <div className="absolute z-10 flex flex-col items-center gap-2" style={{top: "8%", right: "12%"}}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1.5px solid #166534"}}>
                <Landmark className="w-6 h-6" style={{color: "#166534"}} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-center text-foreground">Gov<br/>Schemes</p>
            </div>
            <div className="absolute z-10 flex flex-col items-center gap-2" style={{bottom: "8%", left: "12%"}}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1.5px solid #166534"}}>
                <Sprout className="w-6 h-6" style={{color: "#166534"}} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-center text-foreground">Crop<br/>Advisory</p>
            </div>
            <div className="absolute z-10 flex flex-col items-center gap-2" style={{bottom: "8%", right: "12%"}}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1.5px solid #166534"}}>
                <Users className="w-6 h-6" style={{color: "#166534"}} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-center text-foreground">Direct Farmer<br/>Buyer Connect</p>
            </div>
            <div className="absolute z-10 flex flex-col items-center gap-2" style={{bottom: "0%", left: "50%", transform: "translateX(-50%)"}}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1.5px solid #166534"}}>
                <TrendingUp className="w-6 h-6" style={{color: "#166534"}} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-center text-foreground">MSP Calculator</p>
            </div>
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

      {/* How It Works */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">{t("howItWorks")}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Users className="w-10 h-10" />, step: "1", title: "Register & Choose Role", desc: "Sign up as a Farmer or Buyer. Farmers list crops, buyers browse and bid." },
              { icon: <TrendingUp className="w-10 h-10" />, step: "2", title: "List or Bid on Crops", desc: "Farmers set base prices. Buyers place competitive bids. Transparent & fair." },
              { icon: <ArrowRight className="w-10 h-10" />, step: "3", title: "Connect & Trade", desc: "Accept the best bid. Connect directly. No middlemen, better profits." },
            ].map((item, i) => (
              <ScrollReveal key={i}>
                <div className="bg-card rounded-2xl p-8 text-center shadow-card border border-border hover:shadow-kisan transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
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

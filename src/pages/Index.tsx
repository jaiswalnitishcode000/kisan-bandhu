import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { ShoppingCart, Sprout, Landmark, Users, ArrowRight, TrendingUp } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=1920&q=80)` }}
        />
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
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("aboutDescription")}
              </p>
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

    <div className="relative flex items-center justify-center min-h-[500px]">
      
      {/* Center Logo */}
      <div className="absolute z-10 w-32 h-32 rounded-full border-2 flex items-center justify-center bg-white shadow-lg" style={{borderColor: "#166534"}}>
        <div className="text-center">
          <img src="/favicon.ico" alt="logo" className="w-10 h-10 mx-auto" />
          <p className="text-xs font-bold mt-1" style={{color: "#166534"}}>KISAN<br/>BANDHU</p>
        </div>
      </div>

      {/* Top Left */}
      <div className="absolute flex items-center gap-4" style={{top: "5%", left: "10%"}}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1px solid #166534"}}>
          <ShoppingCart className="w-7 h-7" style={{color: "#166534"}} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Crop<br/>Marketplace</p>
      </div>

      {/* Top Right */}
      <div className="absolute flex items-center gap-4" style={{top: "5%", right: "10%"}}>
        <p className="text-sm font-semibold uppercase tracking-wide text-foreground text-right">Gov<br/>Schemes</p>
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1px solid #166534"}}>
          <Landmark className="w-7 h-7" style={{color: "#166534"}} />
        </div>
      </div>

      {/* Bottom Left */}
      <div className="absolute flex items-center gap-4" style={{bottom: "5%", left: "10%"}}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1px solid #166534"}}>
          <Sprout className="w-7 h-7" style={{color: "#166534"}} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Crop<br/>Advisory</p>
      </div>

      {/* Bottom Right */}
      <div className="absolute flex items-center gap-4" style={{bottom: "5%", right: "10%"}}>
        <p className="text-sm font-semibold uppercase tracking-wide text-foreground text-right">Direct Farmer<br/>Buyer Connect</p>
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1px solid #166534"}}>
          <Users className="w-7 h-7" style={{color: "#166534"}} />
        </div>
      </div>

      {/* Bottom Center */}
      <div className="absolute flex flex-col items-center gap-2" style={{bottom: "0%"}}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: "#f0fdf4", border: "1px solid #166534"}}>
          <TrendingUp className="w-7 h-7" style={{color: "#166534"}} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-foreground">MSP Calculator</p>
      </div>

    </div>
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

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: "Transparent Bidding System" },
              { value: "Direct", label: "Farmer to Buyer Connect" },
               { value: "Building", label: "Digital Agriculture" },
              { value: "24/7", label: "Support & Assistance" },
            ].map((stat, i) => (
              <ScrollReveal key={i}>
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold">{stat.value}</div>
                  <div className="text-sm mt-1 opacity-80">{stat.label}</div>
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
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">{t("ctaDescription")}</p>
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

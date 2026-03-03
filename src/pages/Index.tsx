import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
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
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-hero-gradient" />
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

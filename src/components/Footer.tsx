import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer style={{background: "linear-gradient(135deg, #22c55e 40%, #161717 40%, #15803d 70%, #242424 100%)"}}>
      
      {/* Top wave */}
      <div style={{lineHeight: 0}}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{display: "block"}}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#f0fdf4"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-6">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.ico" alt="logo" className="w-10 h-10" />
              <span className="text-white font-extrabold text-2xl">Kisan Bandhu</span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed mb-5">
              {t("brandDescription")}
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={16}/>, href: "#" },
                { icon: <Twitter size={16}/>, href: "#" },
                { icon: <Instagram size={16}/>, href: "#" },
                { icon: <Youtube size={16}/>, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{backgroundColor: "rgba(255,255,255,0.15)", color: "white"}}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{backgroundColor: "#4ade80"}}></span>
              {t("quickLinks")}
            </h4>
            <div className="space-y-3">
              {[
  { to: "/marketplace", label: `🛒 ${t("marketplace")}` },
  { to: "/advisory", label: `🌱 ${t("cropAdvisory")}` },
  { to: "/msp-calculator", label: `🧮 ${t("mspCalculator")}` },
  { to: "/schemes", label: `🏛️ ${t("govSchemes")}` },
].map((link, i) => (
                <Link key={i} to={link.to}
                  className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{backgroundColor: "#4ade80"}}></span>
              {t("contactUs")}
            </h4>
            <div className="space-y-4">
              {[
                { icon: <Phone className="w-4 h-4 flex-shrink-0"/>, text: "+91 96253-01837" },
                { icon: <Mail className="w-4 h-4 flex-shrink-0"/>, text: "kisanbandhu.contact@gmail.com" },
                { icon: <MapPin className="w-4 h-4 flex-shrink-0"/>, text: "DTC 28/1, Knowledge Park-III, Greater Noida - 201306 (U.P.)" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-green-100">
                  <div className="mt-0.5 p-1.5 rounded-lg" style={{backgroundColor: "rgba(255,255,255,0.15)"}}>
                    {item.icon}
                  </div>
                  <span className="leading-relaxed">{item.text}</span>
                </div>
              ))}
              <p className="text-xs text-green-200 pl-9">Mon - Sat | 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{backgroundColor: "#4ade80"}}></span>
              {t("stayUpdated")}
            </h4>
            <p className="text-green-100 text-sm mb-4">
              {t("newsletterText")}
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t("enterEmailPlaceholder")}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              />
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{backgroundColor: "#f59e0b", color: "white"}}>
                {t("subscribe")}
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{borderTop: "1px solid rgba(255,255,255,0.15)"}} className="pt-6">
          <div className="flex flex-col items-center gap-3">
            <p className="text-green-200 text-sm">
              © 2026 <span className="text-white font-semibold">Kisan Bandhu</span>. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-green-200">
              <a href="#" className="hover:text-white transition-colors">{t("privacyPolicy")}</a>
              <a href="#" className="hover:text-white transition-colors">{t("termsOfService")}</a>
              <a href="#" className="hover:text-white transition-colors">{t("supportText")}</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
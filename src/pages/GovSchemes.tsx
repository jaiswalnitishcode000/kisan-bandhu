import { useState } from "react";
import { govSchemes } from "@/data/advisoryData";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { Search, FileText, CheckCircle, Star } from "lucide-react";

const GovSchemes = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

const filteredSchemes = govSchemes.filter((scheme) =>
  t(`scheme_${scheme.id}_name`).toLowerCase().includes(search.toLowerCase()) ||
  t(`scheme_${scheme.id}_desc`).toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="min-h-screen">

      {/* Full BG Image Section */}
      <div className="relative min-h-screen overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: `url(https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=1920&q=80)`}}/>
        <div className="absolute inset-0" style={{background: "rgba(0,0,0,0.45)"}}/>

        <div className="relative z-10 flex flex-col items-center px-4 py-16">

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 uppercase tracking-wide">
              {t("governmentSchemesTitle")}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {t("governmentSchemesDescription")}
            </p>
          </div>

          {/* Search glassmorphism card */}
          <div className="w-full max-w-xl mb-10">
            <div className="rounded-2xl p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"/>
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none text-white placeholder-white/60"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Scheme Cards — transparent glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
            {filteredSchemes.map((scheme, i) => (
              <ScrollReveal key={i}>
                <div className="rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}>

                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{scheme.icon}</div>
                    <h3 className="text-lg font-extrabold text-white leading-tight">
                      {t(`scheme_${scheme.id}_name`)}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-white/75 text-sm mb-5 leading-relaxed">
                    {t(`scheme_${scheme.id}_desc`)}
                  </p>

                  <div className="space-y-3 flex-1">

                    {/* Eligibility */}
                    <div className="flex gap-3 p-3 rounded-xl"
                      style={{backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.2)"}}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300"/>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1 text-green-300">{t("eligibilityLabel")}</p>
                        <p className="text-xs text-white/70 leading-relaxed">{t(`scheme_${scheme.id}_eligibility`)}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="flex gap-3 p-3 rounded-xl"
                      style={{backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.2)"}}>
                      <Star className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-300"/>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1 text-yellow-300">{t("benefitsLabel")}</p>
                        <p className="text-xs text-white/70 leading-relaxed">{t(`scheme_${scheme.id}_benefits`)}</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="flex gap-3 p-3 rounded-xl"
                      style={{backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.2)"}}>
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300"/>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1 text-blue-300">{t("requiredDocumentsLabel")}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
  {[
    t(`scheme_${scheme.id}_doc1`),
    t(`scheme_${scheme.id}_doc2`),
    t(`scheme_${scheme.id}_doc3`)
  ].map((doc, j) => (
    <span
      key={j}
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
    >
      {doc}
    </span>
  ))}
</div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => window.open(scheme.link, "_blank")}
                    className="mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.18)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}>
                    {t("applyNow")}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* No results */}
          {filteredSchemes.length === 0 && (
            <div className="text-center py-20">
  <div className="text-5xl mb-4">🔍</div>
  <h3 className="text-xl font-bold text-white mb-2">
    {t("noCropsFound")}
  </h3>
  <p className="text-white/60">
    {t("searchPlaceholder")}
  </p>
</div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GovSchemes;

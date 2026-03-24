import { useState } from "react";
import { govSchemes } from "@/data/advisoryData";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const GovSchemes = () => {
  const { t } = useLanguage();
 const [search, setSearch] = useState("");

  const filteredSchemes = govSchemes.filter((scheme) =>
  t(`scheme_${scheme.id}_name` as any)
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
  <div className="min-h-screen py-8">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("governmentSchemesTitle")}</h1>
          <p className="text-muted-foreground mt-2">{t("governmentSchemesDescription")}</p>
          <div className="max-w-md mx-auto mt-4">
  <input
    type="text"
    placeholder="Search schemes..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
  />
</div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredSchemes.map((scheme, i) => (
          <ScrollReveal key={i}>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 h-full flex flex-col hover:shadow-kisan transition-shadow">
              <div className="text-4xl mb-3">{scheme.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {scheme.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
               {scheme.description}
              </p>
              
              <div className="space-y-3 text-sm flex-1">
                {/* Eligibility */}
<div>
  <span className="font-medium text-foreground">Eligibility:</span>
  <p className="text-muted-foreground text-sm">
    {scheme.eligibility}
  </p>
</div>

{/* Benefits */}
<div>
  <span className="font-medium text-foreground">Benefits:</span>
  <p className="text-muted-foreground text-sm">
    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-md mr-2">
      ★
    </span>
    {scheme.benefits}
  </p>
</div>
                <div>
  <span className="font-medium text-foreground">Required Documents</span>
  <ul className="text-muted-foreground list-disc list-inside text-sm">
    <li>Aadhaar Card</li>
    <li>Land Record</li>
    <li>Bank Account</li>
  </ul>
</div>
              </div>

              <button
                onClick={() => window.open(scheme.link, "_blank")}
                className="mt-4 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                {t("applyNow")}
              </button>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </div>
  );
};

export default GovSchemes;

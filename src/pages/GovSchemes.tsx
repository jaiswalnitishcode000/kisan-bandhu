import { govSchemes } from "@/data/advisoryData";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const GovSchemes = () => {
  const { t } = useLanguage();
  return (
  <div className="min-h-screen py-8">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("governmentSchemesTitle")}</h1>
          <p className="text-muted-foreground mt-2">{t("governmentSchemesDescription")}</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {govSchemes.map((scheme, i) => (
          <ScrollReveal key={i}>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 h-full flex flex-col hover:shadow-kisan transition-shadow">
              <div className="text-4xl mb-3">{scheme.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t(`scheme_${scheme.id}_name` as any)}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t(`scheme_${scheme.id}_desc` as any)}
              </p>
              
              <div className="space-y-3 text-sm flex-1">
                <div>
                  <span className="font-medium text-foreground">{t("eligibilityLabel")}</span>
                  <p className="text-muted-foreground">{t(`scheme_${scheme.id}_eligibility` as any)}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">{t("benefitsLabel")}</span>
                  <p className="text-muted-foreground">{t(`scheme_${scheme.id}_benefits` as any)}</p>
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

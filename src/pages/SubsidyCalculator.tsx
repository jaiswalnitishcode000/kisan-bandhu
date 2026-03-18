import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";

const SubsidyCalculator = () => {
  const { t } = useLanguage();
  const [tractorPrice, setTractorPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subsidyResult, setSubsidyResult] = useState<{ subsidy: number; finalPrice: number } | null>(null);

  const calculateSubsidy = () => {
    const amount = Number(tractorPrice);
    if (Number.isNaN(amount) || amount <= 0 || !category) return;

    let subsidyRate = 0;
    if (category === "general") subsidyRate = 0.25;
    if (category === "scst") subsidyRate = 0.35;
    if (category === "women") subsidyRate = 0.4;

    const subsidy = amount * subsidyRate;
    const finalPrice = amount - subsidy;
    setSubsidyResult({ subsidy, finalPrice });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("tractorSubsidyTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-2">Estimate government subsidy on tractor purchase.</p>
          </div>
        </ScrollReveal>

        <div className="max-w-xl mx-auto bg-card rounded-2xl border border-border shadow-card p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("tractorPriceLabel")}</label>
              <input
                type="number"
                min="0"
                value={tractorPrice}
                onChange={(e) => setTractorPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                placeholder={t("enterTractorPrice")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("farmerCategoryLabel")}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="">{t("selectCategory")}</option>
                <option value="general">{t("categoryGeneralFarmer")}</option>
                <option value="scst">{t("categorySCSTFarmer")}</option>
                <option value="women">{t("categoryWomenFarmer")}</option>
              </select>
            </div>
            <button
              onClick={calculateSubsidy}
              disabled={!tractorPrice || !category}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
            >
              {t("calculateSubsidy")}
            </button>
          </div>

          {subsidyResult && (
            <div className="mt-4 p-4 bg-primary/10 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">{t("governmentSubsidy")}</p>
              <p className="text-2xl font-bold">₹{subsidyResult.subsidy.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("finalPriceAfterSubsidy")}</p>
              <p className="text-2xl font-bold text-green-600">₹{subsidyResult.finalPrice.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubsidyCalculator;

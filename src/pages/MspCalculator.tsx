import { useState } from "react";
import { mspData } from "@/data/advisoryData";
import { useMarket } from "@/context/MarketContext";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";

const MspCalculator = () => {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState<{ mspValue: number; highestBid: number } | null>(null);
  const { listings } = useMarket();

  const cropNames = Object.keys(mspData);

  const keyForCrop = (name: string) => {
    let key = name
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "")
      .replace(/[^a-zA-Z0-9_]/g, "");
    if (key.includes("Chickpea")) key = "Chickpea_Chana";
    return `crop_${key}`;
  };

  const calculate = () => {
    if (!crop || !quantity) return;
    const qty = parseFloat(quantity);
    const msp = mspData[crop] || 0;
    const mspValue = msp * qty;

    // Find highest bid for this crop in marketplace
    const relevantListings = listings.filter((l) => l.cropName.toLowerCase().includes(crop.toLowerCase()));
    const highestBid = relevantListings.reduce((max, l) => {
      const bidMax = l.bids.length > 0 ? Math.max(...l.bids.map((b) => b.amount)) : 0;
      return bidMax > max ? bidMax : max;
    }, 0);

    setResult({ mspValue, highestBid: highestBid * qty });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("mspCalculatorTitle")}</h1>
            <p className="text-muted-foreground mt-2">{t("mspCalculatorDescription")}</p>
          </div>
        </ScrollReveal>

        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("selectCropLabel")}</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                  <option value="">{t("chooseCropPlaceholder")}</option>
                  {cropNames.map((c) => (
                      <option key={c} value={c}>{t(keyForCrop(c) as any)} — ₹{mspData[c]}/quintal</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("quantityLabel")}</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder={t("quantityPlaceholder")} />
              </div>
              <button onClick={calculate} disabled={!crop || !quantity}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                <Calculator className="w-4 h-4" /> {t("calculateMspButton")}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <ScrollReveal>
              <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">{t("mspValueLabel")}</p>
                    <p className="text-2xl font-bold text-primary">₹{result.mspValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t(`crop_${crop.replace(/[^a-zA-Z0-9]/g, "").replace(/Chickpeach?/,"Chickpea_Chana").replace(/ /g,"")}` as any)} × {quantity} quintals</p>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-4 text-center border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">{t("marketBidValueLabel")}</p>
                    <p className="text-2xl font-bold text-accent">
                      {result.highestBid > 0 ? `₹${result.highestBid.toLocaleString()}` : t("noBidsYet")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t("basedOnMarket")}</p>
                  </div>
                </div>
                {result.highestBid > 0 && (
                  <div className={`text-center p-3 rounded-xl text-sm font-medium ${
                    result.highestBid >= result.mspValue ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}>
                    {result.highestBid >= result.mspValue
                      ? t("marketAbove").replace("{diff}", (result.highestBid - result.mspValue).toLocaleString())
                      : t("marketBelow").replace("{diff}", (result.mspValue - result.highestBid).toLocaleString())
                    }
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default MspCalculator;

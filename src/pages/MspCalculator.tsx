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
  //Tractor substidy states
  const [tractorPrice, setTractorPrice] = useState("");
const [category, setCategory] = useState("");
const [subsidyResult, setSubsidyResult] = useState<{ subsidy: number; finalPrice: number } | null>(null);

// Profit calculator states
const [profitCrop, setProfitCrop] = useState("");
const [profitQuantity, setProfitQuantity] = useState("");
const [sellingPrice, setSellingPrice] = useState("");
const [productionCost, setProductionCost] = useState("");

const [profitResult, setProfitResult] = useState<{
  revenue: number;
  cost: number;
  profit: number;
  priceUsed: number;
  usedMsp: boolean;
} | null>(null);

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
  if (!crop || !quantity || parseFloat(quantity) < 0) return;
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
  //sub
  const calculateSubsidy = () => {
  if (!tractorPrice || !category || parseFloat(tractorPrice)<0) return;

  const price = parseFloat(tractorPrice);
  let subsidyRate = 0;

  if (category === "general") subsidyRate = 0.25;
  if (category === "scst") subsidyRate = 0.35;
  if (category === "women") subsidyRate = 0.40;

  const subsidy = price * subsidyRate;
  const finalPrice = price - subsidy;

  setSubsidyResult({ subsidy, finalPrice });
};
// profit calculator
const calculateProfit = () => {
  if (
    !profitCrop ||
    !profitQuantity ||
    !productionCost ||
    parseFloat(profitQuantity) < 0 ||
    parseFloat(productionCost) < 0 ||
    (sellingPrice && parseFloat(sellingPrice) < 0)
  ) return;

  const qty = parseFloat(profitQuantity);
  const cost = parseFloat(productionCost);
  const msp = mspData[profitCrop] || 0;

  const hasCustomPrice = sellingPrice.trim() !== "";
  const priceUsed = hasCustomPrice ? parseFloat(sellingPrice) : msp;

  const revenue = qty * priceUsed;
  const profit = revenue - cost;

  setProfitResult({
    revenue,
    cost,
    profit,
    priceUsed,
    usedMsp: !hasCustomPrice,
  });
};

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("mspCalculatorTitle")}</h1>
          
          </div>
        </ScrollReveal>

        <div className="max-w-xl mx-auto">

  <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
    <Calculator className="w-5 h-5" />
    {t("mspSectionTitle")}
  </h2>

  <div className="border-t border-border my-4"></div>

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
                <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)}
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

        

          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mt-8">
  <h2 className="text-xl font-bold flex items-center gap-2">
    <TrendingUp className="w-5 h-5" />
    {t("tractorSubsidyTitle")}
  </h2>

  <div className="border-t border-border my-4"></div>

  <div className="space-y-4">

    <div>
      <label className="block text-sm font-medium mb-1">
  {t("tractorPriceLabel")}
</label>
      <input
        type="number"
        min="0"
        value={tractorPrice}
        onChange={(e) => setTractorPrice(Math.max(0, Number(e.target.value)).toString())}
        className="w-full px-4 py-2 border rounded-xl"
        placeholder={t("enterTractorPrice")}
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
  {t("farmerCategoryLabel")}
</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border rounded-xl"
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
      <p className="text-xl font-bold">₹{subsidyResult.subsidy.toLocaleString()}</p>

      <p className="text-sm mt-2 text-muted-foreground">{t("finalPriceAfterSubsidy")}</p>
      <p className="text-xl font-bold text-green-600">
        ₹{subsidyResult.finalPrice.toLocaleString()}
      </p>
    </div>
  )}
</div>

{/* PROFIT CALCULATOR */}
<div className="bg-card rounded-2xl border border-border shadow-card p-6 mt-8">

<h2 className="text-xl font-bold flex items-center gap-2">
<ArrowRight className="w-5 h-5" />
{t("profitCalculatorTitle")}
</h2>

<div className="border-t border-border my-4"></div>

<div className="space-y-4">

<div>
<label className="block text-sm font-medium mb-1">
{t("selectCropLabel")}
</label>

<select
value={profitCrop}
onChange={(e) => setProfitCrop(e.target.value)}
className="w-full px-4 py-2 border rounded-xl"
>

<option value="">{t("chooseCropPlaceholder")}</option>

{cropNames.map((c) => (
<option key={c} value={c}>
{t(keyForCrop(c) as any)} — ₹{mspData[c]}
</option>
))}

</select>
</div>

<div>
<label className="block text-sm font-medium mb-1">
{t("quantityLabel")}
</label>

<input
type="number"
min="0"
value={profitQuantity}
onChange={(e) => setProfitQuantity(e.target.value)}
className="w-full px-4 py-2 border rounded-xl"
placeholder={t("quantityPlaceholder")}
/>
</div>

<div>
<label className="block text-sm font-medium mb-1">
{t("sellingPriceLabel")}
</label>

<input
type="number"
min="0"
value={sellingPrice}
onChange={(e) => setSellingPrice(e.target.value)}
className="w-full px-4 py-2 border rounded-xl"
placeholder={t("sellingPricePlaceholder")}
/>
</div>

<div>
<label className="block text-sm font-medium mb-1">
{t("productionCostLabel")}
</label>

<input
type="number"
min="0"
value={productionCost}
onChange={(e) => setProductionCost(e.target.value)}
className="w-full px-4 py-2 border rounded-xl"
placeholder={t("productionCostPlaceholder")}
/>
</div>

<button
onClick={calculateProfit}
disabled={!profitCrop || !profitQuantity || !productionCost}
className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
>

{t("calculateProfitButton")}

</button>

</div>

{profitResult && (

<div className="mt-4 p-4 bg-primary/10 rounded-xl space-y-4">

<div className="text-center">

<p className="text-sm text-muted-foreground">
{t("priceUsedLabel")}
</p>

<p className="text-lg font-semibold">
₹{profitResult.priceUsed.toLocaleString()} / quintal
</p>

<p className="text-xs text-muted-foreground mt-1">
{profitResult.usedMsp ? t("usedMspLabel") : t("usedCustomPriceLabel")}
</p>

</div>

<div className="grid grid-cols-3 gap-4">

<div className="bg-background rounded-xl p-4 text-center border">

<p className="text-sm text-muted-foreground">
{t("totalRevenueLabel")}
</p>

<p className="text-xl font-bold">
₹{profitResult.revenue.toLocaleString()}
</p>

</div>

<div className="bg-background rounded-xl p-4 text-center border">

<p className="text-sm text-muted-foreground">
{t("totalCostLabel")}
</p>

<p className="text-xl font-bold">
₹{profitResult.cost.toLocaleString()}
</p>

</div>

<div className="bg-background rounded-xl p-4 text-center border">

<p className="text-sm text-muted-foreground">
{t("netProfitLabel")}
</p>

<p className={`text-xl font-bold ${profitResult.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
  ₹{Math.abs(profitResult.profit).toLocaleString()}
</p>
<p className={`text-xs mt-1 font-medium ${profitResult.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
  {profitResult.profit >= 0 ? t("profitStatus") : t("lossStatus")}
</p>
</div>
</div>
</div>
)}
</div>
        </div>
      </div>
      </div>
    
  );
};

export default MspCalculator;

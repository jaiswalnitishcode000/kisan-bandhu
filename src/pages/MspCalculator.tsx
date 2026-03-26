import { useState } from "react";
import { mspData } from "@/data/advisoryData";
import { useMarket } from "@/context/MarketContext";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Calculator, TrendingUp, ArrowRight, ChevronLeft } from "lucide-react";

const MspCalculator = () => {
  const { t } = useLanguage();
  const [activeCalc, setActiveCalc] = useState<null | "msp" | "subsidy" | "profit">(null);

  // MSP states
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState<{ mspValue: number; highestBid: number } | null>(null);

  // Tractor subsidy states
  const [tractorPrice, setTractorPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subsidyResult, setSubsidyResult] = useState<{ subsidy: number; finalPrice: number } | null>(null);

  // Profit calculator states
  const [profitCrop, setProfitCrop] = useState("");
  const [profitQuantity, setProfitQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [productionCost, setProductionCost] = useState("");
  const [profitResult, setProfitResult] = useState<{
    revenue: number; cost: number; profit: number; priceUsed: number; usedMsp: boolean;
  } | null>(null);

  const { listings } = useMarket();
  const cropNames = Object.keys(mspData);

  const keyForCrop = (name: string) => {
  let key = name
    .replace(/\s+/g, "")
    .replace(/[()]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");

  if (key.includes("Chickpea")) key = "Chickpea_Chana";

  return `crop_${key}`;
};

  const calculate = () => {
    if (!crop || !quantity || parseFloat(quantity) < 0) return;
    const qty = parseFloat(quantity);
    const msp = mspData[crop] || 0;
    const mspValue = msp * qty;
    const relevantListings = listings.filter((l) => l.cropName.toLowerCase().includes(crop.toLowerCase()));
    const highestBid = relevantListings.reduce((max, l) => {
      const bidMax = l.bids.length > 0 ? Math.max(...l.bids.map((b) => b.amount)) : 0;
      return bidMax > max ? bidMax : max;
    }, 0);
    setResult({ mspValue, highestBid: highestBid * qty });
  };

  const calculateSubsidy = () => {
    if (!tractorPrice || !category || parseFloat(tractorPrice) < 0) return;
    const price = parseFloat(tractorPrice);
    let subsidyRate = 0;
    if (category === "general") subsidyRate = 0.25;
    if (category === "scst") subsidyRate = 0.35;
    if (category === "women") subsidyRate = 0.40;
    const subsidy = price * subsidyRate;
    setSubsidyResult({ subsidy, finalPrice: price - subsidy });
  };

  const calculateProfit = () => {
  if (!profitCrop || !profitQuantity || !productionCost) return;

  const qty = parseFloat(profitQuantity);
  const cost = parseFloat(productionCost);
  const msp = mspData[profitCrop] || 0;
  const hasCustomPrice = sellingPrice.trim() !== "";
  const priceUsed = hasCustomPrice ? parseFloat(sellingPrice) : msp;

  if (qty < 0 || cost < 0 || priceUsed < 0) return;

  const revenue = qty * priceUsed;
  setProfitResult({
    revenue,
    cost,
    profit: revenue - cost,
    priceUsed,
    usedMsp: !hasCustomPrice
  });
};
const cards = [
  {
    key: "msp",
    emoji: "🌾",
    title: t("mspCardTitle"),
    desc: t("mspCardDesc"),
    color: "#166534",
    bg: "linear-gradient(135deg, #166534, #15803d)",
    border: "#bbf7d0",
  },
  {
    key: "subsidy",
    emoji: "🚜",
    title: t("subsidyCardTitle"),
    desc: t("subsidyCardDesc"),
    color: "#b45309",
    bg: "linear-gradient(135deg, #b45309, #d97706)",
    border: "#fde68a",
  },
  {
    key: "profit",
    emoji: "💰",
    title: t("profitCardTitle"),
    desc: t("profitCardDesc"),
    color: "#0369a1",
    bg: "linear-gradient(135deg, #0369a1, #0284c7)",
    border: "#bae6fd",
  },
];

 return (
    <div className="min-h-screen">

      {/* Full bg image section with cards on top */}
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: `url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80)`}}/>
        {/* Light green overlay like AgriMarketplace */}
        <div className="absolute inset-0" 
          style={{background: "rgba(21,128,61,0.55)"}}/>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
          
          {/* Title */}
          <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 uppercase tracking-wide">
  {t("selectCalculatorTitle")}
</h1>
<p className="text-green-100 text-lg">
  {t("selectCalculatorSubtitle")}
</p>
          </div>

          {/* Selector Cards */}
          {!activeCalc && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto">
              {cards.map((card) => (
                <button key={card.key} onClick={() => setActiveCalc(card.key as any)}
                  className="group rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.4)",
                    backdropFilter: "blur(10px)",
                  }}>
                  <div className="text-5xl mb-4">{card.emoji}</div>
                  <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-wide">{card.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">{card.desc}</p>
                  <div className="flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-xl w-fit"
                    style={{backgroundColor: "rgba(255,255,255,0.2)", color: "white"}}>
                    {t("openCalculator")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Back Button */}
          {activeCalc && (
            <button onClick={() => { setActiveCalc(null); setResult(null); setSubsidyResult(null); setProfitResult(null); }}
              className="mb-8 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{backgroundColor: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.4)"}}>
<<<<<<< HEAD
              <ChevronLeft className="w-4 h-4"/> Back  to  Calculators
=======
              <ChevronLeft className="w-4 h-4"/> {t("backToCalculators")}
>>>>>>> 070bbe8cd6db12130803e15415e1bbec8d320dd2
            </button>
          )}

          {/* Calculator Forms */}
          <div className="w-full max-w-xl">

        

        {/* MSP CALCULATOR */}
        {activeCalc === "msp" && (
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 text-white" style={{background: "linear-gradient(135deg, #166534, #15803d)"}}>
                  <div className="text-4xl mb-2">🌾</div>
                 <h2 className="text-2xl font-extrabold">{t("mspSectionTitle")}</h2>
                 <p className="text-green-100 text-sm mt-1">{t("mspCalculatorDescription")}</p>
                </div>
                {/* Form */}
                <div className="bg-card p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                       {t("selectCropLabel")}
                    </label>
                    <select value={crop} onChange={(e) => setCrop(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:outline-none"
                      style={{"--tw-ring-color": "#166534"} as any}>
                     <option value="">{t("chooseCropPlaceholder")}</option>
                      {cropNames.map((c) => (
                        <option key={c} value={c}>{t(keyForCrop(c) as any)} — ₹{mspData[c]}/quintal</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      {t("quantityLabel")}
                    </label>
                    <input
  type="number"
  min="0"
  value={quantity}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setQuantity(value);
    }
  }}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:outline-none"
                      placeholder={t("quantityPlaceholder")}/>
                  </div>
                  <button onClick={calculate} disabled={!crop || !quantity}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{backgroundColor: "#166534"}}>
                    <Calculator className="w-5 h-5"/> {t("calculateMspButton")}
                  </button>
                </div>
              </div>

              {/* Result */}
              {result && (
                <div className="mt-6 rounded-3xl overflow-hidden shadow-xl">
                  <div className="p-4 text-white text-center font-bold" style={{backgroundColor: "#166534"}}>
                    📊 {t("mspResultTitle")}
                  </div>
                  <div className="bg-card p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl p-4 text-center" style={{backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0"}}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("mspValueLabel")}
                        </p>
                        <p className="text-2xl font-extrabold" style={{color: "#166534"}}>₹{result.mspValue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{crop} × {quantity} qtl</p>
                      </div>
                      <div className="rounded-2xl p-4 text-center" style={{backgroundColor: "#fffbeb", border: "1px solid #fde68a"}}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("marketBidLabel")}
                        </p>
                        <p className="text-2xl font-extrabold" style={{color: "#b45309"}}>
                          {result.highestBid > 0 ? `₹${result.highestBid.toLocaleString()}` : t("noBids")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("basedOnMarketplace")}
                        </p>
                      </div>
                    </div>
                    {result.highestBid > 0 && (
                      <div className={`text-center p-3 rounded-xl text-sm font-semibold`}
                        style={{
                          backgroundColor: result.highestBid >= result.mspValue ? "#f0fdf4" : "#fff1f2",
                          color: result.highestBid >= result.mspValue ? "#166534" : "#dc2626",
                        }}>
                        {result.highestBid >= result.mspValue
                          ? `✅ ${t("marketAbove")} ₹${(result.highestBid - result.mspValue).toLocaleString()}`
                          : `⚠️ ${t("marketBelow")} ₹${(result.mspValue - result.highestBid).toLocaleString()}`
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}


              {activeCalc === "subsidy" && (
  <ScrollReveal>
    <div className="max-w-xl mx-auto">
      <div className="rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="p-6 text-white"
          style={{ background: "linear-gradient(135deg, #b45309, #d97706)" }}
        >
          <div className="text-4xl mb-2">🚜</div>
          <h2 className="text-2xl font-extrabold">{t("tractorSubsidyTitle")}</h2>
          <p className="text-yellow-100 text-sm mt-1">
            {t("tractorSubsidySubtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="bg-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              {t("tractorPriceLabel")}
            </label>
            <input
              type="number"
              min="0"
              value={tractorPrice}
              onChange={(e) => {
  const value = e.target.value;
  if (value === "" || Number(value) >= 0) {
    setTractorPrice(value);
  }
}}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none"
              placeholder={t("enterTractorPrice")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              {t("farmerCategoryLabel")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none"
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
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#b45309" }}
          >
            <TrendingUp className="w-5 h-5" /> {t("calculateSubsidy")}
          </button>
        </div>
      </div>

      {subsidyResult && (
        <div className="mt-6 rounded-3xl overflow-hidden shadow-xl">
          <div
            className="p-4 text-white text-center font-bold"
            style={{ backgroundColor: "#b45309" }}
          >
            🎉 {t("subsidyResultTitle")}
          </div>
          <div className="bg-card p-6">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {t("governmentSubsidy")}
                </p>
                <p className="text-2xl font-extrabold" style={{ color: "#b45309" }}>
                  ₹{subsidyResult.subsidy.toLocaleString()}
                </p>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {t("finalPriceAfterSubsidy")}
                </p>
                <p className="text-2xl font-extrabold" style={{ color: "#166534" }}>
                  ₹{subsidyResult.finalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <div
              className="mt-4 p-3 rounded-xl text-center text-sm font-semibold"
              style={{ backgroundColor: "#f0fdf4", color: "#166534" }}
            >
              ✅ {t("subsidySavedMessage")} ₹{subsidyResult.subsidy.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  </ScrollReveal>
  )}

        {/* PROFIT CALCULATOR */}
        {activeCalc === "profit" && (
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 text-white" style={{background: "linear-gradient(135deg, #0369a1, #0284c7)"}}>
                  <div className="text-4xl mb-2">💰</div>
                  <h2 className="text-2xl font-extrabold">{t("profitCalculatorTitle")}</h2>
                  <p className="text-blue-100 text-sm mt-1">{t("profitCalculatorSubtitle")}</p>
                </div>
                <div className="bg-card p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      {t("selectCropLabel")}
                    </label>
                    <select value={profitCrop} onChange={(e) => setProfitCrop(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none">
                      <option value="">{t("chooseCropPlaceholder")}</option>
                      {cropNames.map((c) => (
                        <option key={c} value={c}>{t(keyForCrop(c) as any)} — ₹{mspData[c]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      {t("quantityQuintalsLabel")}
                    </label>
                    <input
  type="number"
  min="0"
  value={profitQuantity}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setProfitQuantity(value);
    }
  }}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none"
                      placeholder={t("quantityPlaceholder")}/>
                  </div>
                  <div>
                   <label className="block text-sm font-semibold mb-2 text-foreground">
                     {t("sellingPriceLabel")}
                   </label>
                    <input
  type="number"
  min="0"
  value={sellingPrice}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setSellingPrice(value);
    }
  }}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none"
                      placeholder={t("sellingPricePlaceholder")}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      {t("productionCostLabel")}
                    </label>
                    <input
  type="number"
  min="0"
  value={productionCost}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setProductionCost(value);
    }
  }}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none"
                      placeholder={t("productionCostPlaceholder")}/>
                  </div>
                  <button onClick={calculateProfit} disabled={!profitCrop || !profitQuantity || !productionCost}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{backgroundColor: "#0369a1"}}>
                    <Calculator className="w-5 h-5" /> {t("calculateProfit")}
                  </button>
                </div>
              </div>

              {profitResult && (
                <div className="mt-6 rounded-3xl overflow-hidden shadow-xl">
                  <div className="p-4 text-white text-center font-bold" style={{backgroundColor: "#0369a1"}}>
                    📊 {t("profitResultTitle")}
                  </div>
                  <div className="bg-card p-6 space-y-4">
                    <div className="text-center p-3 rounded-xl text-sm"
                      style={{backgroundColor: "#f0f9ff", border: "1px solid #bae6fd"}}>
                      <p className="text-sm text-muted-foreground mb-1">{t("priceUsedLabel")}</p>
                      <p className="font-bold text-lg" style={{color: "#0369a1"}}>₹{profitResult.priceUsed.toLocaleString()}/quintal</p>
                      {profitResult.usedMsp && (
                        <p className="text-sm text-red-500 mt-2">📌 {t("mspPriceUsedLabel")}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: t("revenueLabel"), value: profitResult.revenue, color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
                        { label: t("costLabel"), value: profitResult.cost, color: "#dc2626", bg: "#fff1f2", border: "#fecdd3" },
                        { label: profitResult.profit >= 0 ? t("profitLabel") : t("lossLabel"), value: Math.abs(profitResult.profit), color: profitResult.profit >= 0 ? "#166534" : "#dc2626", bg: profitResult.profit >= 0 ? "#f0fdf4" : "#fff1f2", border: profitResult.profit >= 0 ? "#bbf7d0" : "#fecdd3" },
                      ].map((item, i) => (
                        <div key={i} className="rounded-2xl p-4 text-center"
                          style={{backgroundColor: item.bg, border: `1px solid ${item.border}`}}>
                          <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                          <p className="text-lg font-extrabold" style={{color: item.color}}>₹{item.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

      </div>
        </div>
      </div>
    </div>
  );
};

export default MspCalculator;
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { TrendingUp, TrendingDown, BarChart2, Cloud, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";


const crops = [
  { name: "cropWheat", emoji: "🌾", price: 2275, change: +45, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "cropRiceBasmati", emoji: "🍚", price: 3200, change: +80, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "cropCotton", emoji: "🌿", price: 6500, change: -120, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "cropSoybean", emoji: "🫘", price: 4400, change: +60, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "cropMaize", emoji: "🌽", price: 1850, change: -30, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "cropTomato", emoji: "🍅", price: 2800, change: +200, unit: "₹/quintal", demand: "Very High", trend: "up" },
  { name: "cropOnion", emoji: "🧅", price: 1900, change: -150, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "cropPotato", emoji: "🥔", price: 1200, change: +20, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "cropSugarcane", emoji: "🎋", price: 315, change: +5, unit: "₹/quintal", demand: "Stable", trend: "up" },
  { name: "cropTurmeric", emoji: "🟡", price: 9500, change: +300, unit: "₹/quintal", demand: "Very High", trend: "up" },
  { name: "cropChilli", emoji: "🌶️", price: 12000, change: -500, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "cropGroundnut", emoji: "🥜", price: 5800, change: +100, unit: "₹/quintal", demand: "High", trend: "up" },
];

const stateData = [
  { state: "statePunjab", topCrop: "cropWheat", emoji: "🌾", avgPrice: "₹2,300/q", trend: "up" },
  { state: "stateUttarPradesh", topCrop: "cropSugarcane", emoji: "🎋", avgPrice: "₹315/q", trend: "up" },
  { state: "stateMaharashtra", topCrop: "cropCotton", emoji: "🌿", avgPrice: "₹6,500/q", trend: "down" },
  { state: "stateMadhyaPradesh", topCrop: "cropSoybean", emoji: "🫘", avgPrice: "₹4,400/q", trend: "up" },
  { state: "stateAndhraPradesh", topCrop: "cropChilli", emoji: "🌶️", avgPrice: "₹12,000/q", trend: "down" },
  { state: "stateKarnataka", topCrop: "cropTurmeric", emoji: "🟡", avgPrice: "₹9,500/q", trend: "up" },
  { state: "stateGujarat", topCrop: "cropGroundnut", emoji: "🥜", avgPrice: "₹5,800/q", trend: "up" },
  { state: "stateWestBengal", topCrop: "cropRiceBasmati", emoji: "🍚", avgPrice: "₹3,200/q", trend: "up" },
];

const weatherData = [
  { region: "northIndia", condition: "clear", impact: "wheatHarvestGood", color: "#166534" },
  { region: "southIndia", condition: "heavyRain", impact: "cottonRisk", color: "#dc2626" },
  { region: "eastIndia", condition: "partlyCloudy", impact: "riceModerate", color: "#d97706" },
  { region: "westIndia", condition: "sunny", impact: "groundnutGood", color: "#166534" },
  { region: "centralIndia", condition: "intermittentRain", impact: "soybeanWatch", color: "#d97706" },
];

const chartData = [
  { month: "Oct", wheat: 2100, rice: 3000, cotton: 6800 },
  { month: "Nov", wheat: 2150, rice: 3050, cotton: 6700 },
  { month: "Dec", wheat: 2180, rice: 3100, cotton: 6600 },
  { month: "Jan", wheat: 2200, rice: 3150, cotton: 6550 },
  { month: "Feb", wheat: 2230, rice: 3180, cotton: 6520 },
  { month: "Mar", wheat: 2275, rice: 3200, cotton: 6500 },
];

const MiniChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 30;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const MarketInsights = () => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState("cropWheat");
  const [activeTab, setActiveTab] = useState("prices");

  const selectedData = chartData;
  const cropChartData = {
    Wheat: chartData.map(d => d.wheat),
    "Rice (Basmati)": chartData.map(d => d.rice),
    Cotton: chartData.map(d => d.cotton),
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Banner */}
      <div className="py-12 text-white text-center"
        style={{background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)"}}>
        <div className="container mx-auto px-4">
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-4xl font-extrabold mb-2">{t("marketInsightsTitle")}</h1>
<p className="text-green-100 text-lg max-w-xl mx-auto">
  {t("marketInsightsSubtitle")}
</p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-green-100">
            <span>🕒 {t("updatedText")}</span>
            <span>📍 {t("panIndia")}</span>
            <span>🌾 {t("cropsTracked")}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { key: "prices", label: `💹 ${t("livePrices")}` },
              { key: "charts", label: `📈 ${t("priceCharts")}` },
              { key: "states", label: `🗺️ ${t("stateWise")}` },
              { key: "demand", label: `📦 ${t("demandTrends")}` },
              { key: "weather", label: `🌦️ ${t("weatherImpact")}` },
].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  backgroundColor: activeTab === tab.key ? "#166534" : "transparent",
                  color: activeTab === tab.key ? "white" : "#6b7280",
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">

        {/* LIVE PRICES TAB */}
        {activeTab === "prices" && (
          <ScrollReveal>
            <div>
             <h2 className="text-2xl font-bold text-foreground mb-6">
  💹 {t("liveMandiRates")} <span className="text-sm font-normal text-muted-foreground ml-2">({t("demoData")})</span>
</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crops.map((crop, i) => (
                  <div key={i}
                    className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{crop.emoji}</span>
                        <div>
                          <p className="font-bold text-foreground">{t(crop.name)}</p>
                          <p className="text-xs text-muted-foreground">{crop.unit}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg`}
                        style={{
                          backgroundColor: crop.trend === "up" ? "#f0fdf4" : "#fff1f2",
                          color: crop.trend === "up" ? "#166534" : "#dc2626",
                        }}>
                        {crop.trend === "up" ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                        {crop.change > 0 ? "+" : ""}{crop.change}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-extrabold text-foreground">
                        ₹{crop.price.toLocaleString()}
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: crop.demand === "Very High" ? "#fef9c3" :
                                           crop.demand === "High" ? "#f0fdf4" :
                                           crop.demand === "Medium" ? "#fff7ed" : "#f0f9ff",
                          color: crop.demand === "Very High" ? "#854d0e" :
                                 crop.demand === "High" ? "#166534" :
                                 crop.demand === "Medium" ? "#c2410c" : "#0369a1",
                        }}>
                        {crop.demand === "Very High"
                          ? t("veryHighDemand")
                          : crop.demand === "High"
                          ? t("highDemand")
                          : crop.demand === "Medium"
                          ? t("mediumDemand")
                          : t("stableDemand")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* PRICE CHARTS TAB */}
        {activeTab === "charts" && (
          <ScrollReveal>
            <div>
<h2 className="text-2xl font-bold text-foreground mb-2">📈 {t("sixMonthPriceTrends")}</h2>
<p className="text-muted-foreground mb-6 text-sm">{t("selectCropPriceHistory")}</p>

              {/* Crop selector */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["cropWheat", "cropRiceBasmati", "cropCotton"].map(crop => (
  <button key={crop} onClick={() => setSelectedCrop(crop)}
    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
    style={{
      backgroundColor: selectedCrop === crop ? "#166534" : "#f0fdf4",
      color: selectedCrop === crop ? "white" : "#166534",
      border: "1px solid #bbf7d0",
    }}>
    {t(crop)}
  </button>
))}
              </div>

              {/* Chart */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-6 text-foreground">{t(selectedCrop)} — {t("priceTrendOctMar")}</h3>
                <div className="flex items-end gap-3 h-48">
                  {chartData.map((d, i) => {
                    const val = selectedCrop === "cropWheat" ? d.wheat :
            selectedCrop === "cropRiceBasmati" ? d.rice : d.cotton;

const maxVal = selectedCrop === "cropWheat" ? 2300 :
              selectedCrop === "cropRiceBasmati" ? 3300 : 7000;
                    const height = (val / maxVal) * 100;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 gap-2">
                        <span className="text-xs font-bold text-foreground">₹{val.toLocaleString()}</span>
                        <div className="w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${height}%`,
                            backgroundColor: "#166534",
                            opacity: 0.7 + (i * 0.05),
                          }}/>
                        <span className="text-xs text-muted-foreground">{d.month}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Mini sparklines comparison */}
                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  {[
                    { name: "cropWheat", emoji: "🌾", data: chartData.map(d => d.wheat), color: "#166534" },
                    { name: "cropRiceBasmati", emoji: "🍚", data: chartData.map(d => d.rice), color: "#0369a1" },
                    { name: "cropCotton", emoji: "🌿", data: chartData.map(d => d.cotton), color: "#7c3aed" },
].map((c, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-semibold text-foreground mb-2">{t(c.name)} {c.emoji}</p>
                      <MiniChart data={c.data} color={c.color} />
                      <p className="text-xs text-muted-foreground mt-1">
                        ₹{c.data[0].toLocaleString()} → ₹{c.data[c.data.length-1].toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* STATE WISE TAB */}
        {activeTab === "states" && (
          <ScrollReveal>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">🗺️ {t("stateWiseCropPrices")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stateData.map((s, i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 border border-border flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                        style={{backgroundColor: "#f0fdf4"}}>
                        <MapPin className="w-5 h-5" style={{color: "#166534"}}/>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{t(s.state)}</p>
                        <p className="text-sm text-muted-foreground">{t("topCrop")}: {t(s.topCrop)} {s.emoji}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-lg" style={{color: "#166534"}}>{s.avgPrice}</p>
                      <div className="flex items-center justify-end gap-1 text-xs font-medium"
                        style={{color: s.trend === "up" ? "#166534" : "#dc2626"}}>
                        {s.trend === "up" ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                        {s.trend === "up" ? t("rising") : t("falling")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* DEMAND TRENDS TAB */}
        {activeTab === "demand" && (
          <ScrollReveal>
            <div>
             <h2 className="text-2xl font-bold text-foreground mb-6">📦 {t("demandSupplyTrends")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crops.slice(0, 8).map((crop, i) => {
                  const demandPct = crop.demand === "Very High" ? 90 :
                                   crop.demand === "High" ? 75 :
                                   crop.demand === "Stable" ? 60 : 45;
                  const supplyPct = crop.trend === "up" ? demandPct - 15 : demandPct + 10;
                  return (
                    <div key={i} className="bg-card rounded-2xl p-5 border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{crop.emoji}</span>
                       <p className="font-bold text-foreground">{t(crop.name)}</p>
                        <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: crop.demand === "Very High" ? "#fef9c3" : crop.demand === "High" ? "#f0fdf4" : "#fff7ed",
                            color: crop.demand === "Very High" ? "#854d0e" : crop.demand === "High" ? "#166534" : "#c2410c",
                          }}>
                          {crop.demand === "Very High"
                            ? t("veryHighDemand")
                            : crop.demand === "High"
                            ? t("highDemand")
                            : crop.demand === "Stable"
                            ? t("stableDemand")
                            : t("mediumDemand")}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t("demandLabel")}</span>
                            <span className="font-semibold" style={{color: "#166534"}}>{demandPct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{width: `${demandPct}%`, backgroundColor: "#166534"}}/>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t("supplyLabel")}</span>
                            <span className="font-semibold" style={{color: "#f59e0b"}}>{Math.min(supplyPct, 100)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{width: `${Math.min(supplyPct, 100)}%`, backgroundColor: "#f59e0b"}}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* WEATHER IMPACT TAB */}
        {activeTab === "weather" && (
          <ScrollReveal>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">🌦️ {t("weatherImpactCrops")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {weatherData.map((w, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Cloud className="w-5 h-5" style={{color: w.color}}/>
                      <p className="font-bold text-foreground">{t(w.region)}</p>
                    </div>
                    <p className="text-2xl mb-2">{t(w.condition)}</p>
                    <p className="text-sm text-muted-foreground">{t(w.impact)}</p>
                    <div className="mt-3 text-xs font-semibold px-3 py-1 rounded-full inline-block"
                      style={{
                        backgroundColor: w.color === "#166534" ? "#f0fdf4" : w.color === "#dc2626" ? "#fff1f2" : "#fffbeb",
                        color: w.color,
                      }}>
                      {w.color === "#166534"
  ? `✅ ${t("favorable")}`
  : w.color === "#dc2626"
  ? `⚠️ ${t("riskAlert")}`
  : `🔔 ${t("monitor")}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Advisory */}
              <div className="rounded-2xl p-6"
                style={{background: "linear-gradient(135deg, #166534, #15803d)"}}>
               <h3 className="text-white font-bold text-lg mb-4">🌾 {t("weeklyFarmingAdvisory")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    
                     { title: t("sowNow"), crops: t("sowNowCrops"), icon: "🌱" },
                     { title: t("harvestReady"), crops: t("harvestReadyCrops"), icon: "🌾" },
                     { title: t("avoidThisWeek"), crops: t("avoidThisWeekCrops"), icon: "⚠️" },

                  ].map((a, i) => (
                    <div key={i} className="rounded-xl p-4" style={{backgroundColor: "rgba(255,255,255,0.15)"}}>
                      <p className="text-2xl mb-2">{a.icon}</p>
                   <p className="text-white font-bold text-sm">{a.title}</p>
                   <p className="text-green-100 text-xs mt-1">{a.crops}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
};

export default MarketInsights;
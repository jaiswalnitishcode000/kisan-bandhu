import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { TrendingUp, TrendingDown, BarChart2, Cloud, MapPin } from "lucide-react";

const crops = [
  { name: "Wheat", emoji: "🌾", price: 2275, change: +45, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "Rice (Basmati)", emoji: "🍚", price: 3200, change: +80, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "Cotton", emoji: "🌿", price: 6500, change: -120, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "Soybean", emoji: "🫘", price: 4400, change: +60, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "Maize", emoji: "🌽", price: 1850, change: -30, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "Tomato", emoji: "🍅", price: 2800, change: +200, unit: "₹/quintal", demand: "Very High", trend: "up" },
  { name: "Onion", emoji: "🧅", price: 1900, change: -150, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "Potato", emoji: "🥔", price: 1200, change: +20, unit: "₹/quintal", demand: "High", trend: "up" },
  { name: "Sugarcane", emoji: "🎋", price: 315, change: +5, unit: "₹/quintal", demand: "Stable", trend: "up" },
  { name: "Turmeric", emoji: "🟡", price: 9500, change: +300, unit: "₹/quintal", demand: "Very High", trend: "up" },
  { name: "Chilli", emoji: "🌶️", price: 12000, change: -500, unit: "₹/quintal", demand: "Medium", trend: "down" },
  { name: "Groundnut", emoji: "🥜", price: 5800, change: +100, unit: "₹/quintal", demand: "High", trend: "up" },
];

const stateData = [
  { state: "Punjab", topCrop: "Wheat 🌾", avgPrice: "₹2,300/q", trend: "up" },
  { state: "Uttar Pradesh", topCrop: "Sugarcane 🎋", avgPrice: "₹315/q", trend: "up" },
  { state: "Maharashtra", topCrop: "Cotton 🌿", avgPrice: "₹6,500/q", trend: "down" },
  { state: "Madhya Pradesh", topCrop: "Soybean 🫘", avgPrice: "₹4,400/q", trend: "up" },
  { state: "Andhra Pradesh", topCrop: "Chilli 🌶️", avgPrice: "₹12,000/q", trend: "down" },
  { state: "Karnataka", topCrop: "Turmeric 🟡", avgPrice: "₹9,500/q", trend: "up" },
  { state: "Gujarat", topCrop: "Groundnut 🥜", avgPrice: "₹5,800/q", trend: "up" },
  { state: "West Bengal", topCrop: "Rice 🍚", avgPrice: "₹3,200/q", trend: "up" },
];

const weatherData = [
  { region: "North India", condition: "☀️ Clear", impact: "Good for Wheat harvest", color: "#166534" },
  { region: "South India", condition: "🌧️ Heavy Rain", impact: "Risk for Cotton & Chilli", color: "#dc2626" },
  { region: "East India", condition: "⛅ Partly Cloudy", impact: "Moderate for Rice", color: "#d97706" },
  { region: "West India", condition: "🌤️ Sunny", impact: "Good for Groundnut", color: "#166534" },
  { region: "Central India", condition: "🌦️ Intermittent Rain", impact: "Watch Soybean moisture", color: "#d97706" },
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
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
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
          <h1 className="text-4xl font-extrabold mb-2">Market Insights</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Live mandi rates, price trends, state-wise data & weather impact — all in one place.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm text-green-100">
            <span>🕒 Updated: Today, 9:00 AM</span>
            <span>📍 Pan India Data</span>
            <span>🌾 12 Crops Tracked</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { key: "prices", label: "💹 Live Prices" },
              { key: "charts", label: "📈 Price Charts" },
              { key: "states", label: "🗺️ State Wise" },
              { key: "demand", label: "📦 Demand Trends" },
              { key: "weather", label: "🌦️ Weather Impact" },
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
                💹 Live Mandi Rates <span className="text-sm font-normal text-muted-foreground ml-2">(Demo Data)</span>
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
                          <p className="font-bold text-foreground">{crop.name}</p>
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
                        {crop.demand} Demand
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
              <h2 className="text-2xl font-bold text-foreground mb-2">📈 6-Month Price Trends</h2>
              <p className="text-muted-foreground mb-6 text-sm">Select a crop to view its price history</p>

              {/* Crop selector */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["Wheat", "Rice (Basmati)", "Cotton"].map(crop => (
                  <button key={crop} onClick={() => setSelectedCrop(crop)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: selectedCrop === crop ? "#166534" : "#f0fdf4",
                      color: selectedCrop === crop ? "white" : "#166534",
                      border: "1px solid #bbf7d0",
                    }}>
                    {crop}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-6 text-foreground">{selectedCrop} — Price Trend (Oct–Mar)</h3>
                <div className="flex items-end gap-3 h-48">
                  {chartData.map((d, i) => {
                    const val = selectedCrop === "Wheat" ? d.wheat :
                                selectedCrop === "Rice (Basmati)" ? d.rice : d.cotton;
                    const maxVal = selectedCrop === "Wheat" ? 2300 :
                                  selectedCrop === "Rice (Basmati)" ? 3300 : 7000;
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
                    { name: "Wheat 🌾", data: chartData.map(d => d.wheat), color: "#166534" },
                    { name: "Rice 🍚", data: chartData.map(d => d.rice), color: "#0369a1" },
                    { name: "Cotton 🌿", data: chartData.map(d => d.cotton), color: "#7c3aed" },
                  ].map((c, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-semibold text-foreground mb-2">{c.name}</p>
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
              <h2 className="text-2xl font-bold text-foreground mb-6">🗺️ State Wise Crop Prices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stateData.map((s, i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 border border-border flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                        style={{backgroundColor: "#f0fdf4"}}>
                        <MapPin className="w-5 h-5" style={{color: "#166534"}}/>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{s.state}</p>
                        <p className="text-sm text-muted-foreground">Top Crop: {s.topCrop}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-lg" style={{color: "#166534"}}>{s.avgPrice}</p>
                      <div className="flex items-center justify-end gap-1 text-xs font-medium"
                        style={{color: s.trend === "up" ? "#166534" : "#dc2626"}}>
                        {s.trend === "up" ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                        {s.trend === "up" ? "Rising" : "Falling"}
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
              <h2 className="text-2xl font-bold text-foreground mb-6">📦 Demand & Supply Trends</h2>
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
                        <p className="font-bold text-foreground">{crop.name}</p>
                        <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: crop.demand === "Very High" ? "#fef9c3" : crop.demand === "High" ? "#f0fdf4" : "#fff7ed",
                            color: crop.demand === "Very High" ? "#854d0e" : crop.demand === "High" ? "#166534" : "#c2410c",
                          }}>
                          {crop.demand}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Demand</span>
                            <span className="font-semibold" style={{color: "#166534"}}>{demandPct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{width: `${demandPct}%`, backgroundColor: "#166534"}}/>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Supply</span>
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
              <h2 className="text-2xl font-bold text-foreground mb-6">🌦️ Weather Impact on Crops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {weatherData.map((w, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Cloud className="w-5 h-5" style={{color: w.color}}/>
                      <p className="font-bold text-foreground">{w.region}</p>
                    </div>
                    <p className="text-2xl mb-2">{w.condition}</p>
                    <p className="text-sm text-muted-foreground">{w.impact}</p>
                    <div className="mt-3 text-xs font-semibold px-3 py-1 rounded-full inline-block"
                      style={{
                        backgroundColor: w.color === "#166534" ? "#f0fdf4" : w.color === "#dc2626" ? "#fff1f2" : "#fffbeb",
                        color: w.color,
                      }}>
                      {w.color === "#166534" ? "✅ Favorable" : w.color === "#dc2626" ? "⚠️ Risk Alert" : "🔔 Monitor"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Advisory */}
              <div className="rounded-2xl p-6"
                style={{background: "linear-gradient(135deg, #166534, #15803d)"}}>
                <h3 className="text-white font-bold text-lg mb-4">🌾 Weekly Farming Advisory</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Sow Now", crops: "Wheat, Mustard, Peas", icon: "🌱" },
                    { title: "Harvest Ready", crops: "Rice, Maize, Soybean", icon: "🌾" },
                    { title: "Avoid This Week", crops: "Cotton (rain risk)", icon: "⚠️" },
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
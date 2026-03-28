import { useState } from "react";
import { soilTypes, seasons, regions, getCropSuggestions, CropSuggestion } from "@/data/advisoryData";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Droplets, Sprout, Coins, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

const CropAdvisory = () => {
  const { t } = useLanguage();

  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [region, setRegion] = useState("");
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropSuggestion | null>(null);

  const handleSearch = () => {
    if (!soil || !season || !region) return;
    setSuggestions(getCropSuggestions(soil, season, region));
    setSearched(true);
  };

  const cropDetails: Record<string, {
    icon: string;
    sowingTime: string;
    harvestTime: string;
    tips: string[];
    warnings: string[];
    soilPrep: string;
    irrigation: string;
    fertilizer: string;
  }> = {
    Rice: {
      icon: "🌾",
      sowingTime: "June – July (Kharif)",
      harvestTime: "October – November",
      tips: [
        "Transplant seedlings at 20–25 days old for best yield.",
        "Maintain 5 cm standing water during tillering stage.",
        "Use SRI (System of Rice Intensification) for higher yield.",
      ],
      warnings: [
        "Watch for Brown Planthopper (BPH) — spray neem-based pesticide.",
        "Avoid waterlogging for more than 3 days during flowering.",
      ],
      soilPrep: "Puddling is essential. Level field properly for uniform water distribution.",
      irrigation: "Flood irrigation or drip. Needs 1200–2000 mm water over season.",
      fertilizer: "120:60:60 kg/ha (NPK). Apply urea in 3 splits.",
    },
    Wheat: {
      icon: "🌿",
      sowingTime: "October – November (Rabi)",
      harvestTime: "March – April",
      tips: [
        "Sow at 100–125 kg/ha seed rate for optimal density.",
        "First irrigation at crown root initiation (21 days after sowing).",
        "Use certified rust-resistant varieties like HD-2967 or PBW-550.",
      ],
      warnings: [
        "Yellow rust can devastate yield — apply propiconazole at first sign.",
        "Avoid late sowing as it drastically reduces yield.",
      ],
      soilPrep: "Deep ploughing followed by 2–3 cultivations. Fine tilth required.",
      irrigation: "4–6 irrigations. Critical stages: CRI, tillering, jointing, milking.",
      fertilizer: "150:75:60 kg/ha (NPK). Top dress urea at tillering.",
    },
    Maize: {
      icon: "🌽",
      sowingTime: "June – July (Kharif) / Jan–Feb (Rabi)",
      harvestTime: "September – October",
      tips: [
        "Plant at 60×20 cm spacing for good yield.",
        "Earthing up at 30 days prevents lodging.",
        "Intercropping with legumes improves soil nitrogen.",
      ],
      warnings: [
        "Fall Armyworm is a serious threat — inspect whorls daily.",
        "Avoid waterlogged conditions — maize roots rot quickly.",
      ],
      soilPrep: "Well-drained loamy soil best. 2–3 ploughings with FYM incorporation.",
      irrigation: "5–6 irrigations. Critical at knee-high, tasseling and grain filling.",
      fertilizer: "180:80:60 kg/ha (NPK). Apply in 3 splits.",
    },
    Cotton: {
      icon: "🤍",
      sowingTime: "April – May",
      harvestTime: "October – December",
      tips: [
        "Use Bt cotton for bollworm protection.",
        "Pinching terminal bud at 75 days increases branching.",
        "Maintain plant population of 11,000–16,000/ha.",
      ],
      warnings: [
        "Pink bollworm is major pest — use pheromone traps.",
        "Avoid excess nitrogen — leads to vegetative growth over boll formation.",
      ],
      soilPrep: "Deep black cotton soil ideal. Deep ploughing in summer recommended.",
      irrigation: "Drip irrigation most efficient. Critical at flowering and boll development.",
      fertilizer: "150:75:75 kg/ha (NPK). Potassium critical for fiber quality.",
    },
    Mustard: {
      icon: "🌼",
      sowingTime: "October – November (Rabi)",
      harvestTime: "February – March",
      tips: [
        "Thin seedlings to 10–15 cm spacing at 2-week stage.",
        "One irrigation at branching stage doubles yield.",
        "Varieties like Pusa Bold and RH-30 give high oil content.",
      ],
      warnings: [
        "Aphid attack in February is common — spray dimethoate.",
        "White rust fungus — spray mancozeb at first symptom.",
      ],
      soilPrep: "Well-drained sandy loam preferred. Fine tilth improves germination.",
      irrigation: "1–2 irrigations sufficient. Avoid excess moisture.",
      fertilizer: "80:40:40 kg/ha (NPK) + sulphur 40 kg/ha for oil quality.",
    },
    Sugarcane: {
      icon: "🎋",
      sowingTime: "February – March (Spring) / October (Autumn)",
      harvestTime: "12–18 months after planting",
      tips: [
        "Use single-eye setts for better germination.",
        "Trash mulching conserves moisture and controls weeds.",
        "Ratoon cropping gives good returns with low cost.",
      ],
      warnings: [
        "Red rot is most destructive disease — use disease-free seed material.",
        "Top borer and early shoot borer — use carbofuran at planting.",
      ],
      soilPrep: "Deep ploughing + subsoiling. Furrow planting at 90 cm spacing.",
      irrigation: "Regular irrigation every 7–10 days. Drip saves 30–40% water.",
      fertilizer: "250:85:120 kg/ha (NPK) in splits over the growing season.",
    },
    Soybean: {
      icon: "🫘",
      sowingTime: "June – July (Kharif)",
      harvestTime: "September – October",
      tips: [
        "Seed treatment with Rhizobium inoculant fixes atmospheric nitrogen.",
        "Narrow row spacing (30 cm) increases pod count.",
        "Intercropping with sorghum gives stability.",
      ],
      warnings: [
        "Stem fly and girdle beetle are major pests in early crop.",
        "Excess moisture causes root rot — ensure proper drainage.",
      ],
      soilPrep: "Well-drained medium to heavy soil. Avoid compacted soils.",
      irrigation: "Rainfed crop mostly. Critical irrigation at flowering if dry spell occurs.",
      fertilizer: "30:60:40 kg/ha (NPK) + rhizobium culture. Low N as plant fixes own N.",
    },
    Groundnut: {
      icon: "🥜",
      sowingTime: "June – July (Kharif) / Jan–Feb (Rabi)",
      harvestTime: "September – October",
      tips: [
        "Gypsum application at flowering improves pod filling.",
        "Earthing up at 30–40 days helps pegs to penetrate soil.",
        "Harvest when inner shell shows dark marks.",
      ],
      warnings: [
        "Tikka leaf spot — spray chlorothalonil at first appearance.",
        "Aflatoxin contamination risk in dry weather — harvest on time.",
      ],
      soilPrep: "Sandy loam, well-drained. Deep ploughing + fine tilth essential.",
      irrigation: "4–5 irrigations. Avoid irrigation near harvest to prevent aflatoxin.",
      fertilizer: "20:40:40 kg/ha (NPK) + gypsum 500 kg/ha at flowering.",
    },
  };

  const getDefaultCropDetail = (name: string) => ({
    icon: "🌱",
    sowingTime: "Consult local agricultural officer",
    harvestTime: "Varies by region and variety",
    tips: [
      "Follow local KVK (Krishi Vigyan Kendra) recommendations.",
      "Use certified seeds from government-approved sources.",
      "Maintain crop diary for better planning next season.",
    ],
    warnings: [
      "Monitor regularly for pest and disease symptoms.",
      "Check weather forecast before spraying pesticides.",
    ],
    soilPrep: "Standard tillage practices recommended for your soil type.",
    irrigation: "Based on crop water requirement and local rainfall.",
    fertilizer: "Soil test-based fertilizer application recommended.",
  });

  const getCropDetail = (name: string) =>
    cropDetails[name] || getDefaultCropDetail(name);

  const keyForOption = (prefix: string, value: string) => {
    let norm = value;
    if (prefix === "season") {
      norm = value.split(/[\s(]/)[0];
    }
    let key = norm
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "")
      .replace(/-/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    if (prefix === "crop" && value.includes("Chickpea")) key = "Chickpea_Chana";
    return `${prefix}_${key}`;
  };

  const waterColor = (w: string) => {
    if (w === "High") return "text-blue-400";
    if (w === "Medium") return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 py-12 px-4">
        <div className="container mx-auto">

          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                {t("cropAdvisoryTitle")}
              </h1>
              <p className="text-green-200 mt-3 text-lg drop-shadow">
                {t("cropAdvisoryDescription")}
              </p>
            </div>
          </ScrollReveal>

          {/* Selection Card — Glassmorphism */}
          <ScrollReveal>
            <div
              className="rounded-3xl p-8 mb-10 max-w-3xl mx-auto"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                {/* Soil */}
                <div>
                  <label className="block text-sm font-semibold text-green-100 mb-2 tracking-wide uppercase">
                    {t("soilTypeLabel")}
                  </label>
                  <select
                    value={soil}
                    onChange={(e) => setSoil(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <option value="" className="text-black">{t("selectSoilPlaceholder")}</option>
                    {soilTypes.map((s) => (
                      <option key={s} value={s} className="text-black">
                        {t(keyForOption("soil", s) as any)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-semibold text-green-100 mb-2 tracking-wide uppercase">
                    {t("seasonLabel")}
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <option value="" className="text-black">{t("selectSeasonPlaceholder")}</option>
                    {seasons.map((s) => (
                      <option key={s} value={s} className="text-black">
                        {t(keyForOption("season", s) as any)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-semibold text-green-100 mb-2 tracking-wide uppercase">
                    {t("regionLabel")}
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <option value="" className="text-black">{t("selectRegionPlaceholder")}</option>
                    {regions.map((r) => (
                      <option key={r} value={r} className="text-black">
                        {t(keyForOption("region", r) as any)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!soil || !season || !region}
                className="w-full py-4 rounded-xl font-bold text-white text-base tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: (!soil || !season || !region)
                    ? "rgba(34,197,94,0.4)"
                    : "linear-gradient(135deg, #16a34a, #15803d)",
                  boxShadow: (!soil || !season || !region) ? "none" : "0 4px 20px rgba(22,163,74,0.5)",
                }}
              >
                🌱 {t("getRecommendations")}
              </button>
            </div>
          </ScrollReveal>

          {/* Results */}
          {searched && suggestions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {suggestions.map((crop, i) => {
                const detail = getCropDetail(crop.name);
                return (
                  <ScrollReveal key={i}>
                    <div
                      className="rounded-2xl p-6 flex flex-col hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.13)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                      }}
                    >
                      <div className="text-4xl mb-3">{detail.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-4">{crop.name}</h3>

                      <div className="space-y-3 text-sm flex-1">
                        <div className="flex items-center gap-2 text-green-200">
                          <Sprout className="w-4 h-4 text-green-400 shrink-0" />
                          <span><span className="font-semibold text-white">{t("yieldLabel")}</span> {crop.expectedYield.replace("quintals/hectare", t("unit_quintalsPerHectare"))}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-200">
                          <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                          <span><span className="font-semibold text-white">{t("profitLabel")}</span> {crop.estimatedProfit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className={`w-4 h-4 shrink-0 ${waterColor(crop.waterRequirement)}`} />
                          <span className="text-green-200">
                            <span className="font-semibold text-white">{t("waterLabel")}</span>{" "}
                            <span className={waterColor(crop.waterRequirement)}>
                              {t(`water_${crop.waterRequirement}` as any)}
                            </span>
                          </span>
                        </div>

                        {/* Sowing & Harvest */}
                        <div className="mt-2 pt-3 border-t border-white/10 text-green-200 space-y-1.5">
                          <p>🗓️ <span className="text-white font-medium">Sowing:</span> {detail.sowingTime}</p>
                          <p>🌾 <span className="text-white font-medium">Harvest:</span> {detail.harvestTime}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedCrop(crop)}
                        className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{
                          background: "rgba(255,255,255,0.18)",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                      >
                        📋 Full Advisory
                      </button>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {searched && suggestions.length === 0 && (
            <div
              className="text-center py-12 rounded-2xl max-w-md mx-auto"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <p className="text-white text-lg">😔 {t("noCropsFound")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Advisory Modal */}
      {selectedCrop && (() => {
        const detail = getCropDetail(selectedCrop.name);
        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div
              className="rounded-3xl p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(15, 40, 15, 0.92)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{detail.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCrop.name}</h2>
                    <p className="text-green-400 text-sm">{t("completeCropAdvisory")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="p-2 rounded-xl text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
  {
    icon: <Sprout className="w-4 h-4" />,
    label: t("yieldLabel"),
    value: selectedCrop.expectedYield.replace("quintals/hectare", t("unit_quintalsPerHectare")),
    color: "text-green-400"
  },
  {
    icon: <Coins className="w-4 h-4" />,
    label: t("profitLabel"),
    value: selectedCrop.estimatedProfit,
    color: "text-yellow-400"
  },
  {
    icon: <Droplets className="w-4 h-4" />,
    label: t("waterLabel"),
    value: t(`water_${selectedCrop.waterRequirement}` as any),
    color: "text-blue-400"
  },
].map((stat, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className={`flex justify-center mb-1 ${stat.color}`}>{stat.icon}</div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Sowing & Harvest */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs text-gray-400 mb-1">🗓️ {t("sowingTime")}</p>
                  <p className="text-sm text-white font-medium">{t(detail.sowingTime as any)}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs text-gray-400 mb-1">🌾 {t("harvestTime")}</p> 
                  <p className="text-sm text-white font-medium">{t(detail.harvestTime as any)}</p>
                </div>
              </div>

              {/* Soil Prep */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-semibold text-white">{t("soilPreparation")}</p>
                </div>
                <p className="text-sm text-gray-300">{t(detail.soilPrep as any)}</p>
              </div>

              {/* Irrigation */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-semibold text-white">Irrigation</p>
                </div>
                <p className="text-sm text-gray-300">{detail.irrigation}</p>
              </div>

              {/* Fertilizer */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🧪</span>
                  <p className="text-sm font-semibold text-white">Fertilizer Recommendation</p>
                </div>
                <p className="text-sm text-gray-300">{detail.fertilizer}</p>
              </div>

              {/* Tips */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-semibold text-green-300">Expert Tips</p>
                </div>
                <ul className="space-y-2">
                  {detail.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5">✓</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm font-semibold text-yellow-300">Warnings & Watch-outs</p>
                </div>
                <ul className="space-y-2">
                  {detail.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5">⚠</span> {w}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedCrop(null)}
                className="w-full py-3 rounded-xl font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              >
                Close
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CropAdvisory;
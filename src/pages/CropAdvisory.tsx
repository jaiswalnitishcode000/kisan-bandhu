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

  // All values are now translation keys — both EN and HI are in LanguageContext
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
      sowingTime: "riceSowingTime",
      harvestTime: "riceHarvestTime",
      soilPrep: "riceSoilPrep",
      irrigation: "riceIrrigation",
      fertilizer: "riceFertilizer",
      tips: ["riceTip1", "riceTip2", "riceTip3"],
      warnings: ["riceWarning1", "riceWarning2"],
    },
    Wheat: {
      icon: "🌿",
      sowingTime: "wheatSowingTime",
      harvestTime: "wheatHarvestTime",
      soilPrep: "wheatSoilPrep",
      irrigation: "wheatIrrigation",
      fertilizer: "wheatFertilizer",
      tips: ["wheatTip1", "wheatTip2", "wheatTip3"],
      warnings: ["wheatWarning1", "wheatWarning2"],
    },
    Maize: {
      icon: "🌽",
      sowingTime: "maizeSowingTime",
      harvestTime: "maizeHarvestTime",
      soilPrep: "maizeSoilPrep",
      irrigation: "maizeIrrigation",
      fertilizer: "maizeFertilizer",
      tips: ["maizeTip1", "maizeTip2", "maizeTip3"],
      warnings: ["maizeWarning1", "maizeWarning2"],
    },
    Cotton: {
      icon: "🤍",
      sowingTime: "cottonSowingTime",
      harvestTime: "cottonHarvestTime",
      soilPrep: "cottonSoilPrep",
      irrigation: "cottonIrrigation",
      fertilizer: "cottonFertilizer",
      tips: ["cottonTip1", "cottonTip2", "cottonTip3"],
      warnings: ["cottonWarning1", "cottonWarning2"],
    },
    Mustard: {
      icon: "🌼",
      sowingTime: "mustardSowingTime",
      harvestTime: "mustardHarvestTime",
      soilPrep: "mustardSoilPrep",
      irrigation: "mustardIrrigation",
      fertilizer: "mustardFertilizer",
      tips: ["mustardTip1", "mustardTip2", "mustardTip3"],
      warnings: ["mustardWarning1", "mustardWarning2"],
    },
    Sugarcane: {
      icon: "🎋",
      sowingTime: "sugarcaneSowingTime",
      harvestTime: "sugarcaneHarvestTime",
      soilPrep: "sugarcaneSoilPrep",
      irrigation: "sugarcaneIrrigation",
      fertilizer: "sugarcaneFertilizer",
      tips: ["sugarcaneTip1", "sugarcaneTip2", "sugarcaneTip3"],
      warnings: ["sugarcaneWarning1", "sugarcaneWarning2"],
    },
    Soybean: {
      icon: "🫘",
      sowingTime: "soybeanSowingTime",
      harvestTime: "soybeanHarvestTime",
      soilPrep: "soybeanSoilPrep",
      irrigation: "soybeanIrrigation",
      fertilizer: "soybeanFertilizer",
      tips: ["soybeanTip1", "soybeanTip2", "soybeanTip3"],
      warnings: ["soybeanWarning1", "soybeanWarning2"],
    },
    Groundnut: {
      icon: "🥜",
      sowingTime: "groundnutSowingTime",
      harvestTime: "groundnutHarvestTime",
      soilPrep: "groundnutSoilPrep",
      irrigation: "groundnutIrrigation",
      fertilizer: "groundnutFertilizer",
      tips: ["groundnutTip1", "groundnutTip2", "groundnutTip3"],
      warnings: ["groundnutWarning1", "groundnutWarning2"],
    },
  };

  const getDefaultCropDetail = (_name: string) => ({
    icon: "🌱",
    sowingTime: "defaultSowingTime",
    harvestTime: "defaultHarvestTime",
    soilPrep: "defaultSoilPrep",
    irrigation: "defaultIrrigation",
    fertilizer: "defaultFertilizer",
    tips: ["defaultTip1", "defaultTip2", "defaultTip3"],
    warnings: ["defaultWarning1", "defaultWarning2"],
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
                      <h3 className="text-xl font-bold text-white mb-4">{t(keyForOption("crop", crop.name) as any)}</h3>

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
                          <p>🗓️ <span className="text-white font-medium">{t("sowingTime")}:</span> {t(detail.sowingTime as any)}</p>
                          <p>🌾 <span className="text-white font-medium">{t("harvestTime")}:</span> {t(detail.harvestTime as any)}</p>
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
                        📋 {t("fullAdvisory")}
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
                    <h2 className="text-2xl font-bold text-white">{t(keyForOption("crop", selectedCrop.name) as any)}</h2>
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
                  <p className="text-sm font-semibold text-white">{t("irrigation")}</p>
                </div>
                <p className="text-sm text-gray-300">{t(detail.irrigation as any)}</p>
              </div>

              {/* Fertilizer */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🧪</span>
                  <p className="text-sm font-semibold text-white">{t("fertilizerRecommendation")}</p>
                </div>
                <p className="text-sm text-gray-300">{t(detail.fertilizer as any)}</p>
              </div>

              {/* Tips */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-semibold text-green-300">{t("expertTips")}</p>
                </div>
                <ul className="space-y-2">
                  {detail.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5">✓</span> {t(tip as any)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm font-semibold text-yellow-300">{t("warningsWatchouts")}</p>
                </div>
                <ul className="space-y-2">
                  {detail.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5">⚠</span> {t(w as any)}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedCrop(null)}
                className="w-full py-3 rounded-xl font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              >
                {t("close")}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CropAdvisory;
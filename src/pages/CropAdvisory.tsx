import { useState } from "react";
import { soilTypes, seasons, regions, getCropSuggestions, CropSuggestion } from "@/data/advisoryData";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Droplets, TrendingUp, Sprout, Coins } from "lucide-react";

const CropAdvisory = () => {
  const { t } = useLanguage();
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [region, setRegion] = useState("");
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!soil || !season || !region) return;
    setSuggestions(getCropSuggestions(soil, season, region));
    setSearched(true);
  };

  const keyForOption = (prefix: string, value: string) => {
    // for seasons we only want the core word (Kharif/Rabi/Zaid) so that
    // translation keys (season_Kharif etc.) match.  other values may include
    // parenthetical text which would otherwise produce extra _Monsoon etc.
    let norm = value;
    if (prefix === "season") {
      norm = value.split(/[\s(]/)[0]; // take text before first space or '('
    }

    // normalize: spaces to underscores, parentheses removed, hyphens to underscores
    let key = norm
      .replace(/\s+/g, "_")
      .replace(/[()]/g, "")
      .replace(/-/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    if (prefix === "crop" && value.includes("Chickpea")) key = "Chickpea_Chana";
    return `${prefix}_${key}`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("cropAdvisoryTitle")}</h1>
            <p className="text-muted-foreground mt-2">{t("cropAdvisoryDescription")}</p>
          </div>
        </ScrollReveal>

        {/* Selection */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("soilTypeLabel")}</label>
              <select value={soil} onChange={(e) => setSoil(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">{t("selectSoilPlaceholder")}</option>
                {soilTypes.map((s) => (
                  <option key={s} value={s}>{t(keyForOption("soil", s) as any)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("seasonLabel")}</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">{t("selectSeasonPlaceholder")}</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>{t(keyForOption("season", s) as any)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("regionLabel")}</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">{t("selectRegionPlaceholder")}</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{t(keyForOption("region", r) as any)}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={handleSearch} disabled={!soil || !season || !region}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {t("getRecommendations")}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {suggestions.map((crop, i) => (
              <ScrollReveal key={i}>
                <div className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-kisan transition-shadow">
                  <div className="text-3xl mb-3">🌾</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{crop.name}</h3>
                  <div className="space-y-2.5 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Sprout className="w-4 h-4 text-primary" /> {t("yieldLabel")} {crop.expectedYield.replace("quintals/hectare", t("unit_quintalsPerHectare"))}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Coins className="w-4 h-4 text-primary" /> {t("profitLabel")} {crop.estimatedProfit}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Droplets className="w-4 h-4 text-primary" /> {t("waterLabel")} {t(`water_${crop.waterRequirement}` as any)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropAdvisory;

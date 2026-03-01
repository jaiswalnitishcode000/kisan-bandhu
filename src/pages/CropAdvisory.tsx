import { useState } from "react";
import { soilTypes, seasons, regions, getCropSuggestions, CropSuggestion } from "@/data/advisoryData";
import ScrollReveal from "@/components/ScrollReveal";
import { Droplets, TrendingUp, Sprout, Coins } from "lucide-react";

const CropAdvisory = () => {
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">🌱 Crop Advisory</h1>
            <p className="text-muted-foreground mt-2">Get personalized crop recommendations based on your conditions</p>
          </div>
        </ScrollReveal>

        {/* Selection */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Soil Type</label>
              <select value={soil} onChange={(e) => setSoil(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">Select Soil</option>
                {soilTypes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Season</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">Select Season</option>
                {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">Select Region</option>
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleSearch} disabled={!soil || !season || !region}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            Get Recommendations
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
                      <Sprout className="w-4 h-4 text-primary" /> Yield: {crop.expectedYield}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Coins className="w-4 h-4 text-primary" /> Profit: {crop.estimatedProfit}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Droplets className="w-4 h-4 text-primary" /> Water: {crop.waterRequirement}
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

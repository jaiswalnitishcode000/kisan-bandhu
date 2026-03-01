import { useState } from "react";
import { mspData } from "@/data/advisoryData";
import { useMarket } from "@/context/MarketContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";

const MspCalculator = () => {
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState<{ mspValue: number; highestBid: number } | null>(null);
  const { listings } = useMarket();

  const cropNames = Object.keys(mspData);

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">🧮 MSP Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate Minimum Support Price value for your harvest</p>
          </div>
        </ScrollReveal>

        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Crop</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                  <option value="">Choose a crop</option>
                  {cropNames.map((c) => <option key={c} value={c}>{c} — ₹{mspData[c]}/quintal</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (quintals)</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="e.g. 50" />
              </div>
              <button onClick={calculate} disabled={!crop || !quantity}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                <Calculator className="w-4 h-4" /> Calculate MSP Value
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <ScrollReveal>
              <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">MSP Value</p>
                    <p className="text-2xl font-bold text-primary">₹{result.mspValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{crop} × {quantity} quintals</p>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-4 text-center border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Market Bid Value</p>
                    <p className="text-2xl font-bold text-accent">
                      {result.highestBid > 0 ? `₹${result.highestBid.toLocaleString()}` : "No bids yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Based on current marketplace</p>
                  </div>
                </div>
                {result.highestBid > 0 && (
                  <div className={`text-center p-3 rounded-xl text-sm font-medium ${
                    result.highestBid >= result.mspValue ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}>
                    {result.highestBid >= result.mspValue
                      ? `✅ Market bid is ₹${(result.highestBid - result.mspValue).toLocaleString()} above MSP!`
                      : `⚠️ Market bid is ₹${(result.mspValue - result.highestBid).toLocaleString()} below MSP. Consider MSP route.`
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

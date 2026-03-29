import { useState } from "react";
import { CropListing } from "@/context/MarketContext";
import { TrendingUp, User, Package, Gavel } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CropCardProps {
  listing: CropListing;
  onBid?: (id: string, amount: number) => void;
  showBid?: boolean;
  transparent?: boolean;
}

const CropCard = ({ listing, onBid, showBid = true, transparent = false }: CropCardProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const { t } = useLanguage();
  const highestBid = listing.bids.length > 0 ? Math.max(...listing.bids.map((b) => b.amount)) : 0;

  const cropEmojis: Record<string, string> = {
    grain: "🌾", vegetable: "🥬", fruit: "🍎", cash_crop: "🌿", pulse: "🫘",
  };

  return (
    <div className="rounded-xl overflow-hidden transition-shadow duration-300 group"
  style={{
    background: transparent ? "transparent" : "white",
    border: transparent ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
    boxShadow: transparent ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
  }}>
      {/* Image placeholder with emoji and status badge */}
      <div className="h-40 flex items-center justify-center text-6xl relative"
  style={{backgroundColor: transparent ? "rgba(255,255,255,0.08)" : "#f0fdf4"}}>
        {cropEmojis[listing.cropType] || "🌱"}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
          listing.status === "open" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        }`}>
          {listing.status === "open" ? t("status_Open") : t("status_Sold")}
        </span>
      </div>

      {/* Details section below image */}
      <div className="p-4 space-y-1.5 text-sm"
  style={{color: transparent ? "rgba(255,255,255,0.75)" : "#374151"}}>
        <h3 className="text-lg font-semibold truncate"
  style={{color: transparent ? "white" : "#111827"}}>{listing.cropName}</h3>
        <p className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {listing.farmerName}</p>
        <p className="flex items-center gap-2"><Package className="w-3.5 h-3.5" /> {listing.quantity} quintals</p>
        <p className="flex items-center gap-2 font-medium"
  style={{color: transparent ? "white" : "#111827"}}>
          {t("card_base")} ₹{listing.basePrice.toLocaleString()}/quintal
        </p>
        {highestBid > 0 && (
          <p className="flex items-center gap-2 text-primary font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> {t("card_highestBid")} ₹{highestBid.toLocaleString()}
          </p>
        )}

        {showBid && listing.status === "open" && onBid && (
         <div className="pt-2 space-y-2"
  style={{borderTop: transparent ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb"}}>
            <div className="flex gap-2">
          <input
        
  type="number"
  min="0"
  placeholder={t("card_yourBidPlaceholder")}
  value={bidAmount}
  onChange={(e) => {
    const value = e.target.value;
    if (Number(value) >= 0 || value === "") {
      setBidAmount(value);
    }
  }}
  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none text-black placeholder-gray-500"
  style={{ backgroundColor: "white", border: "1px solid #d1d5db" }}
/>
              <button
                onClick={() => {
                  const amt = parseFloat(bidAmount);
                  if (amt > 0) { onBid(listing.id, amt); setBidAmount(""); }
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Gavel className="w-3.5 h-3.5" /> {t("card_bidButton")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCard;

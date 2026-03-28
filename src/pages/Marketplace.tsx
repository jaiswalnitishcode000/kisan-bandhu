import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import CropCard from "@/components/CropCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Search, SlidersHorizontal, ShoppingBag, Leaf, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const API = "https://kisan-bandhu-production.up.railway.app";
const Marketplace = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");

 const cropTypes = [
  { value: "all", label: `🌿 ${t("allCrops")}` },
  { value: "grain", label: `🌾 ${t("grains")}` },
  { value: "vegetable", label: `🥦 ${t("vegetables")}` },
  { value: "fruit", label: `🍎 ${t("fruits")}` },
  { value: "cash_crop", label: `💰 ${t("cashCrops")}` },
  { value: "pulse", label: `🫘 ${t("pulses")}` },
];

  const fetchListings = () => {
    fetch(`${API}/farmers`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(() => toast.error("Could not load marketplace"));
  };

  useEffect(() => { fetchListings(); }, []);

  const formatListing = (l: any) => ({
    id: String(l.id),
    farmerName: l.name,
    farmerEmail: l.farmer_email || "",
    cropName: l.crop,
    cropType: l.crop_type || "grain",
    quantity: l.quantity,
    basePrice: l.price,
    village: l.village,
    status: l.status,
    imageUrl: "",
    createdAt: l.id,
    bids: (l.bids || []).map((b: any) => ({
      buyerName: b.buyerName,
      buyerEmail: b.buyer_email || "",
      amount: b.amount,
      timestamp: Date.now()
    }))
  });

  const handleBid = async (listingId: string, amount: number) => {
    if (!user) { toast.error(t("pleaseLoginBid")); return; }
    if (user.role !== "buyer") { toast.error(t("onlyBuyer")); return; }
    const res = await fetch(`${API}/bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: Number(listingId),
        buyer_email: user.email,
        buyer_name: user.name,
        amount: amount
      })
    });
    if (res.ok) { toast.success(t("bidSuccess")); fetchListings(); }
    else { const err = await res.json(); toast.error(err.detail || "Bid failed"); }
  };

  const formattedListings = listings.map(formatListing);
  let filtered = formattedListings.filter((l) => {
    const matchSearch = l.cropName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || l.cropType === filterType;
    return matchSearch && matchType && l.status === "open";
  });

  if (sortBy === "price-low") filtered.sort((a, b) => a.basePrice - b.basePrice);
  else if (sortBy === "price-high") filtered.sort((a, b) => b.basePrice - a.basePrice);
  else if (sortBy === "quantity") filtered.sort((a, b) => b.quantity - a.quantity);
  else filtered.sort((a, b) => b.createdAt - a.createdAt);

  const totalListings = formattedListings.length;
  const openListings = formattedListings.filter(l => l.status === "open").length;
  const totalBids = formattedListings.reduce((acc, l) => acc + l.bids.length, 0);

  return (
    <div className="min-h-screen relative">

      {/* Full Page BG Image */}
      <div className="fixed inset-0 bg-cover bg-center -z-10"
        style={{backgroundImage: `url(https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80)`}}/>
      <div className="fixed inset-0 -z-10"
        style={{background: "rgba(0,0,0,0.60)"}}/>

      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 uppercase tracking-wide">
              🛒 {t("marketplaceTitle")}
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              {t("marketplaceSubtitle")}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: <ShoppingBag className="w-5 h-5"/>, value: totalListings, label: t("totalListings") },
              { icon: <Leaf className="w-5 h-5"/>, value: openListings, label: t("totalListings") },
              { icon: <TrendingUp className="w-5 h-5"/>, value: totalBids, label: t("totalBids") },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.20)",
                }}>
                <div className="text-white/70">{stat.icon}</div>
                <div>
                  <div className="text-xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filter Glassmorphism */}
          <div className="rounded-2xl p-5 mb-8"
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.20)",
            }}>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"/>
                <input
                  type="text"
                  placeholder={t("searchCropsPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none text-white placeholder-white/40"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                />
              </div>
              {/* Sort */}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl text-sm focus:outline-none text-white"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}>
                <option value="latest" style={{color:"#1f2937"}}>{t("latest")}</option>
                <option value="price-low" style={{color:"#1f2937"}}>{t("priceLowHigh")}</option>
                <option value="price-high" style={{color:"#1f2937"}}>{t("priceHighLow")}</option>
                <option value="quantity" style={{color:"#1f2937"}}>{t("byQuantity")}</option>
              </select>
            </div>

            {/* Crop type pills */}
            <div className="flex flex-wrap gap-2">
              {cropTypes.map((c) => (
                <button key={c.value} onClick={() => setFilterType(c.value)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: filterType === c.value ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.12)",
                    color: filterType === c.value ? "#166534" : "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result info */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/60 text-sm">
              {t("showingListings").replace("{count}", String(filtered.length))}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <SlidersHorizontal className="w-3 h-3"/>
              {t("sortedBy")} <span className="text-white font-semibold ml-1">
  {t(sortBy)}
</span>
            </div>
          </div>

          {/* Cards Grid — Glassmorphism */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-xl font-bold text-white mb-2">{t("noCropsFound")}</h3>
              <p className="text-white/50 text-sm">
                {search ? `No results for "${search}"` :t("noListingsAvailable")}
              </p>
              {user?.role === "farmer" && (
                <p className="mt-4 text-sm font-semibold text-green-300">
                  {t("listCropsMessage")} 🌱
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-12">
              {filtered.map((listing) => (
                <ScrollReveal key={listing.id}>
                  <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.20)",
                    }}>
                    <CropCard
  listing={listing}
  onBid={handleBid}
  showBid={user?.role === "buyer"}
  transparent={true}
/>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Marketplace;
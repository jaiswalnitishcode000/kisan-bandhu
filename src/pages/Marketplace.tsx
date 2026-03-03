import { useState } from "react";
import { useMarket } from "@/context/MarketContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import CropCard from "@/components/CropCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

const Marketplace = () => {
  const { listings, placeBid } = useMarket();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");

  const cropTypes = [
    { value: "all", label: t("market_crop_all") },
    { value: "grain", label: t("market_crop_grain") },
    { value: "vegetable", label: t("market_crop_vegetable") },
    { value: "fruit", label: t("market_crop_fruit") },
    { value: "cash_crop", label: t("market_crop_cash_crop") },
    { value: "pulse", label: t("market_crop_pulse") },
  ];

  const handleBid = (listingId: string, amount: number) => {
    if (!user) { toast.error(t("pleaseLoginBid")); return; }
    if (user.role !== "buyer") { toast.error(t("onlyBuyer")); return; }
    placeBid(listingId, {
      buyerName: user.name,
      buyerEmail: user.email,
      amount,
      timestamp: Date.now(),
    });
    toast.success(t("bidSuccess"));
  };

  let filtered = listings.filter((l) => {
    const matchSearch = l.cropName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || l.cropType === filterType;
    return matchSearch && matchType;
  });

  if (sortBy === "price-low") filtered.sort((a, b) => a.basePrice - b.basePrice);
  else if (sortBy === "price-high") filtered.sort((a, b) => b.basePrice - a.basePrice);
  else if (sortBy === "quantity") filtered.sort((a, b) => b.quantity - a.quantity);
  else filtered.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("marketplaceTitle")}</h1>
            <p className="text-muted-foreground mt-2">{t("marketplaceDescription")}</p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-8 shadow-card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text" placeholder={t("searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                {cropTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="latest">{t("sortLatest")}</option>
                <option value="price-low">{t("sortPriceLow")}</option>
                <option value="price-high">{t("sortPriceHigh")}</option>
                <option value="quantity">{t("sortQuantity")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-4">🌾</p>
            <p className="text-lg">{t("noCropsFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((listing) => (
              <ScrollReveal key={listing.id}>
                <CropCard listing={listing} onBid={handleBid} showBid={user?.role === "buyer"} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

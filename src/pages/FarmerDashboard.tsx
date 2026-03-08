import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMarket, CropListing } from "@/context/MarketContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Plus, Check, Package, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const FarmerDashboard = () => {
  const [farmers, setFarmers] = useState([]);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/farmers")
    .then(res => res.json())
    .then(data => {

      const formatted = data.farmers.map((f:any) => ({
        id: f[0],
        farmerName: f[1],
        village: f[2],
        cropName: f[3],
        quantity: 0,
        basePrice: 0,
        bids: [],
        status: "open"
      }));

      setFarmers(formatted);
    });
}, []);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { listings, addListing, acceptBid } = useMarket();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cropName: "", quantity: "", basePrice: "", cropType: "grain" });
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  if (!user) return null;

  const myListings = farmers; 
 const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.cropName || !form.quantity || !form.basePrice) {
    toast.error("Fill all fields");
    return;
  }

  await fetch(
    `http://127.0.0.1:8000/add-farmer/${user.name}/${user.village || "unknown"}/${form.cropName}/${form.quantity}/${form.basePrice}`,
    {
      method: "POST",
    }
  );

  toast.success("Farmer Saved To Database");

  setForm({ cropName: "", quantity: "", basePrice: "", cropType: "grain" });
  setShowForm(false);

    toast.success(t("successCropListed"));
  };

  const handleAccept = (id: string) => {
    acceptBid(id);
    toast.success(t("successBidAccepted"));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("farmerDashboardTitle")}</h1>
              <p className="text-muted-foreground mt-1">{t("welcomeUser").replace("{name}", user.name)}</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> {t("addCrop")}
            </button>
          </div>
        </ScrollReveal>

        {/* Add Crop Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{t("listNewCrop")}</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("cropNameLabel")}</label>
                <input type="text" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder={t("cropNamePlaceholder")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("cropTypeLabel")}</label>
                <select value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                  <option value="grain">{t("cropType_grain")}</option>
                  <option value="vegetable">{t("cropType_vegetable")}</option>
                  <option value="fruit">{t("cropType_fruit")}</option>
                  <option value="cash_crop">{t("cropType_cash_crop")}</option>
                  <option value="pulse">{t("cropType_pulse")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("quantityLabel")}</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder={t("quantityPlaceholder")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("basePriceLabel")}</label>
                <input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder={t("basePricePlaceholder")} />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  {t("listCropButton")}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium">
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Listings */}
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-4">🌱</p>
              <p>{t("noListingsMessage")}</p>
            </div>
          ) : (
            myListings.map((listing) => {
              const highestBid = listing.bids.length > 0 ? Math.max(...listing.bids.map((b) => b.amount)) : 0;
              return (
                <div key={listing.id} className="bg-card rounded-2xl border border-border shadow-card p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{listing.cropName}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          listing.status === "open" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                        }`}>
                          {listing.status === "open" ? t("status_Open") : t("status_Sold")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {listing.quantity} quintals</span>
                        <span>Base: ₹{listing.basePrice.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <TrendingUp className="w-3.5 h-3.5" /> {listing.bids.length} {t("bidsSuffix")} {highestBid > 0 && `• Highest: ₹${highestBid.toLocaleString()}`}
                        </span>
                      </div>

                      {/* Bids detail */}
                      {selectedListing === listing.id && listing.bids.length > 0 && (
                        <div className="mt-3 space-y-1 animate-fade-in">
                          {listing.bids.sort((a, b) => b.amount - a.amount).map((bid, i) => (
                            <div key={i} className="flex justify-between items-center text-sm bg-muted/50 rounded-lg px-3 py-2">
                              <span>{bid.buyerName}</span>
                              <span className="font-medium">₹{bid.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      {listing.bids.length > 0 && (
                        <button onClick={() => setSelectedListing(selectedListing === listing.id ? null : listing.id)}
                          className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {t("viewBids")}
                        </button>
                      )}
                      {listing.status === "open" && highestBid > 0 && (
                        <button onClick={() => handleAccept(listing.id)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {t("acceptBest")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

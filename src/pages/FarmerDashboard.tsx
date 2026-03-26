import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Plus, Check, Package, TrendingUp, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const API = "http://127.0.0.1:8000";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [listings, setListings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [form, setForm] = useState({
    cropName: "",
    village: "",
    quantity: "",
    basePrice: "",
    cropType: "grain"
  });

  if (!user) return null;

  // ✅ Sirf is farmer ki listings fetch karo
  const fetchMyListings = () => {
    fetch(`${API}/my-listings/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(() => toast.error("Could not load listings"));
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // ✅ Crop add karo
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.cropName || !form.quantity || !form.basePrice) {
      toast.error("Fill all fields");
      return;
    }

    const res = await fetch(`${API}/add-farmer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farmer_email: user.email,
        name: user.name,
        village: form.village,
        crop: form.cropName,
        crop_type: form.cropType,
        quantity: Number(form.quantity),
        price: Number(form.basePrice)
      })
    });

    if (res.ok) {
      toast.success(t("successCropListed"));
      setForm({ cropName: "", village: "", quantity: "", basePrice: "", cropType: "grain" });
      setShowForm(false);
      fetchMyListings(); // Refresh
    } else {
      toast.error("Failed to add crop");
    }
  };

  // ✅ Best bid accept karo
  const handleAcceptBid = async (listingId: number) => {
    const res = await fetch(`${API}/bid/${listingId}/accept`, { method: "PUT" });
    if (res.ok) {
      toast.success(t("successBidAccepted"));
      fetchMyListings();
    } else {
      toast.error("Could not accept bid");
    }
  };

  // ✅ Listing delete karo
  const handleDelete = async (listingId: number) => {
    const res = await fetch(`${API}/listing/${listingId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Listing removed");
      fetchMyListings();
    }
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
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> {t("addCrop")}
            </button>
          </div>
        </ScrollReveal>

        {/* ── Add Crop Form ── */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{t("listNewCrop")}</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("cropNameLabel")}</label>
                <input type="text" value={form.cropName}
                  onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder={t("cropNamePlaceholder")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Village</label>
                <input type="text" value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Enter village name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("cropTypeLabel")}</label>
                <select value={form.cropType}
                  onChange={(e) => setForm({ ...form, cropType: e.target.value })}
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
                <input type="number" value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder={t("quantityPlaceholder")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("basePriceLabel")}</label>
                <input type="number" value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder={t("basePricePlaceholder")} />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  {t("listCropButton")}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium">
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── My Listings ── */}
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-4">🌱</p>
              <p>{t("noListingsMessage")}</p>
            </div>
          ) : (
            listings.map((listing) => {
              const highestBid = listing.bids.length > 0
                ? Math.max(...listing.bids.map((b: any) => b.amount))
                : 0;

              return (
                <div key={listing.id} className="bg-card rounded-2xl border border-border shadow-card p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{listing.crop}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          listing.status === "open"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}>
                          {listing.status === "open" ? t("status_Open") : t("status_Sold")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" /> {listing.quantity} quintals
                        </span>
                        <span>Base: ₹{(listing.price || 0).toLocaleString()}</span>
                        <span>📍 {listing.village}</span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {listing.bids.length} {t("bidsSuffix")}
                          {highestBid > 0 && ` • Highest: ₹${highestBid.toLocaleString()}`}
                        </span>
                      </div>

                      {/* Bids detail */}
                      {selectedListing === listing.id && listing.bids.length > 0 && (
                        <div className="mt-3 space-y-1 animate-fade-in">
                          {[...listing.bids]
                            .sort((a: any, b: any) => b.amount - a.amount)
                            .map((bid: any, i: number) => (
                              <div key={i} className="flex justify-between items-center text-sm bg-muted/50 rounded-lg px-3 py-2">
                                <span>{bid.buyerName}</span>
                                <span className="font-medium">₹{(bid.amount || 0).toLocaleString()}</span>
                                {bid.status === "accepted" && (
                                  <span className="text-xs text-green-600 font-semibold">✅ Accepted</span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-start gap-2 flex-wrap">
                      {listing.bids.length > 0 && (
                        <button
                          onClick={() => setSelectedListing(selectedListing === listing.id ? null : listing.id)}
                          className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {t("viewBids")}
                        </button>
                      )}
                      {listing.status === "open" && highestBid > 0 && (
                        <button
                          onClick={() => handleAcceptBid(listing.id)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {t("acceptBest")}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
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
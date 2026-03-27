import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CropCard from "@/components/CropCard";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const API = "https://kisan-bandhu-production.up.railway.app";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [listings, setListings] = useState<any[]>([]);

  if (!user) return null;

  // ✅ Saari open listings fetch karo (marketplace)
  const fetchListings = () => {
    fetch(`${API}/farmers`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(() => toast.error("Could not load listings"));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // ✅ Buyer bid kare
  const handleBid = async (listingId: string, amount: number) => {
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

    if (res.ok) {
      toast.success(t("successBidPlaced"));
      fetchListings(); // Refresh to show new bid
    } else {
      const err = await res.json();
      toast.error(err.detail || "Bid failed");
    }
  };

  // ✅ Is buyer ke bids wali listings
  const myBids = listings.filter(l =>
    l.bids.some((b: any) => b.buyerEmail === user.email || b.buyer_email === user.email)
  );

  const openListings = listings.filter(l => l.status === "open");

  // ✅ Backend data ko CropCard ke format mein convert karo
  const formatListing = (l: any) => ({
    id: String(l.id),
    farmerName: l.name,
    farmerEmail: l.farmer_email || "",   // ✅ add
    cropName: l.crop,
    cropType: l.crop_type || "grain",
    quantity: l.quantity,
    basePrice: l.price,
    village: l.village,
    status: l.status,
    imageUrl: "",                         // ✅ add
    createdAt: Date.now(),               // ✅ add
    bids: (l.bids || []).map((b: any) => ({
      buyerName: b.buyerName,
      buyerEmail: b.buyer_email || "",
      amount: b.amount,
      timestamp: Date.now()
    }))
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-3xl font-bold text-foreground mb-1">{t("buyerDashboardTitle")}</h1>
          <p className="text-muted-foreground mb-8">{t("welcomeUser").replace("{name}", user.name)}</p>
        </ScrollReveal>

        {/* ── My Bid History ── */}
        {myBids.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("myBidHistory")}</h2>
            <div className="space-y-3">
              {myBids.map((listing) => {
                const formatted = formatListing(listing);
                const myBid = formatted.bids
                  .filter((b: any) => b.buyerEmail === user.email)
                  .sort((a: any, b: any) => b.amount - a.amount);
                const highestBid = formatted.bids.length > 0
                  ? Math.max(...formatted.bids.map((b: any) => b.amount))
                  : 0;
                const iWon = listing.status === "sold" && myBid[0]?.amount === highestBid;

                return (
                  <div key={listing.id} className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {listing.crop} <span className="text-sm text-muted-foreground">{t("byLabel")} {listing.name}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("myBestBidLabel")} ₹{myBid[0]?.amount.toLocaleString()} • {t("highestLabel")} ₹{highestBid.toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full self-start ${
                      listing.status === "sold"
                        ? iWon ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {listing.status === "sold" ? (iWon ? t("wonStatus") : t("lostStatus")) : t("status_Open")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Available Crops ── */}
        <h2 className="text-xl font-semibold text-foreground mb-4">{t("availableCrops")}</h2>
        {openListings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-4">🌾</p>
            <p>No crops listed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openListings.map((listing) => (
              <CropCard
                key={listing.id}
                listing={formatListing(listing)}
                onBid={handleBid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
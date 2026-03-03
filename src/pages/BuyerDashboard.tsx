import { useAuth } from "@/context/AuthContext";
import { useMarket } from "@/context/MarketContext";
import CropCard from "@/components/CropCard";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { listings, placeBid } = useMarket();

  if (!user) return null;

  const myBids = listings.filter((l) => l.bids.some((b) => b.buyerEmail === user.email));
  const openListings = listings.filter((l) => l.status === "open");

  const handleBid = (listingId: string, amount: number) => {
    placeBid(listingId, { buyerName: user.name, buyerEmail: user.email, amount, timestamp: Date.now() });
    toast.success(t("successBidPlaced"));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-3xl font-bold text-foreground mb-1">{t("buyerDashboardTitle")}</h1>
          <p className="text-muted-foreground mb-8">{t("welcomeUser").replace("{name}", user.name)}</p>
        </ScrollReveal>

        {/* My Bids */}
        {myBids.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("myBidHistory")}</h2>
            <div className="space-y-3">
              {myBids.map((listing) => {
                const myBid = listing.bids.filter((b) => b.buyerEmail === user.email).sort((a, b) => b.amount - a.amount);
                const highestBid = Math.max(...listing.bids.map((b) => b.amount));
                const iWon = listing.status === "sold" && myBid[0]?.amount === highestBid;
                return (
                  <div key={listing.id} className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{listing.cropName} <span className="text-sm text-muted-foreground">{t("byLabel")} {listing.farmerName}</span></h3>
                      <p className="text-sm text-muted-foreground">{t("myBestBidLabel")} ₹{myBid[0]?.amount.toLocaleString()} • {t("highestLabel")} ₹{highestBid.toLocaleString()}</p>
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

        {/* Available Crops */}
        <h2 className="text-xl font-semibold text-foreground mb-4">{t("availableCrops")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {openListings.map((listing) => (
            <CropCard key={listing.id} listing={listing} onBid={handleBid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

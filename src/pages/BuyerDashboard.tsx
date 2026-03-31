import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { ShoppingCart, TrendingUp } from "lucide-react";

const API = "https://kisan-bandhu-production.up.railway.app";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) return null;

  const fetchMyBids = () => {
    fetch(`${API}/farmers`)
      .then(res => res.json())
      .then(data => {
        const bidded = data.filter((l: any) =>
          l.bids?.some((b: any) =>
            b.buyer_email === user.email || b.buyerEmail === user.email
          )
        );
        setMyBids(bidded);
      })
      .catch(() => toast.error("Could not load bids"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMyBids(); }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin text-4xl">🌾</div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">{t("buyerDashboardTitle")}</h1>
              <p className="text-muted-foreground">{t("welcomeUser").replace("{name}", user.name)}</p>
            </div>
            <Link to="/marketplace"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <ShoppingCart className="w-4 h-4" /> Browse Marketplace
            </Link>
          </div>
        </ScrollReveal>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> {t("myBidHistory")}
          </h2>

          {myBids.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-border">
              <p className="text-4xl mb-4">🛒</p>
              <p className="text-lg font-medium mb-2">No bids placed yet</p>
              <p className="text-sm mb-6">Go to Marketplace and bid on crops!</p>
              <Link to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">
                <ShoppingCart className="w-4 h-4" /> Go to Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myBids.map((listing) => {
                const myBid = listing.bids
                  ?.filter((b: any) => b.buyer_email === user.email || b.buyerEmail === user.email)
                  ?.sort((a: any, b: any) => b.amount - a.amount)[0];
                const highestBid = listing.bids?.length > 0
                  ? Math.max(...listing.bids.map((b: any) => b.amount)) : 0;
                const iWon = listing.status === "sold" && myBid?.amount === highestBid;

                return (
                  <div key={listing.id} className="bg-card rounded-xl border border-border shadow-card p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground capitalize">{listing.crop}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            listing.status === "sold"
                              ? iWon ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                              : "bg-secondary text-secondary-foreground"
                          }`}>
                            {listing.status === "sold" ? (iWon ? "🏆 Won" : "❌ Lost") : "⏳ Open"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>👨‍🌾 {listing.name}</span>
                          <span>📍 {listing.village}</span>
                          <span>📦 {listing.quantity} quintals</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mt-2">
                          <span className="text-primary font-semibold">My Bid: ₹{myBid?.amount?.toLocaleString()}</span>
                          <span className="text-muted-foreground">Highest: ₹{highestBid.toLocaleString()}</span>
                          <span className="text-muted-foreground">Base: ₹{listing.price?.toLocaleString()}/q</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
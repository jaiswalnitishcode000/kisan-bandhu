import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMarket, CropListing } from "@/context/MarketContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Plus, Check, Package, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { listings, addListing, acceptBid } = useMarket();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cropName: "", quantity: "", basePrice: "", cropType: "grain" });
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  if (!user) return null;

  const myListings = listings.filter((l) => l.farmerEmail === user.email);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cropName || !form.quantity || !form.basePrice) { toast.error("Fill all fields"); return; }
    addListing({
      cropName: form.cropName,
      quantity: parseFloat(form.quantity),
      basePrice: parseFloat(form.basePrice),
      imageUrl: "",
      farmerName: user.name,
      farmerEmail: user.email,
      cropType: form.cropType,
    });
    setForm({ cropName: "", quantity: "", basePrice: "", cropType: "grain" });
    setShowForm(false);
    toast.success("Crop listed successfully!");
  };

  const handleAccept = (id: string) => {
    acceptBid(id);
    toast.success("Bid accepted! Crop marked as sold.");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">🧑‍🌾 Farmer Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome, {user.name}</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Add Crop
            </button>
          </div>
        </ScrollReveal>

        {/* Add Crop Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4 text-foreground">List a New Crop</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Crop Name</label>
                <input type="text" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="e.g. Wheat" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Crop Type</label>
                <select value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                  <option value="grain">Grain</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="fruit">Fruit</option>
                  <option value="cash_crop">Cash Crop</option>
                  <option value="pulse">Pulse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (quintals)</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="e.g. 50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base Price (₹/quintal)</label>
                <input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="e.g. 2200" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  List Crop
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium">
                  Cancel
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
              <p>You haven't listed any crops yet. Click "Add Crop" to get started!</p>
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
                          {listing.status === "open" ? "Open" : "Sold"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {listing.quantity} quintals</span>
                        <span>Base: ₹{listing.basePrice.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <TrendingUp className="w-3.5 h-3.5" /> {listing.bids.length} bid(s) {highestBid > 0 && `• Highest: ₹${highestBid.toLocaleString()}`}
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
                          <Eye className="w-3.5 h-3.5" /> Bids
                        </button>
                      )}
                      {listing.status === "open" && highestBid > 0 && (
                        <button onClick={() => handleAccept(listing.id)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Accept Best
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

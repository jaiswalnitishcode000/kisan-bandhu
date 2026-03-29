import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";
import { Edit2, Save, X, Trash2, Package, TrendingUp, User, Phone, MapPin, Building2 } from "lucide-react";

const API = "https://kisan-bandhu-production.up.railway.app";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) { navigate("/auth"); return null; }

  const inputClass = "w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none";

  // ✅ Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/profile/${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setProfile(data);
      setEditData(data);
    } catch { toast.error("Could not load profile"); }
  };

  // ✅ Fetch listings (farmer)
  const fetchListings = async () => {
    if (user.role !== "farmer") return;
    try {
      const res = await fetch(`${API}/my-listings/${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setListings(data);
    } catch {}
  };

  // ✅ Fetch bids (buyer) - saari listings fetch karo aur filter karo
  const fetchMyBids = async () => {
    if (user.role !== "buyer") return;
    try {
      const res = await fetch(`${API}/farmers`);
      const allListings = await res.json();
      const bidded = allListings.filter((l: any) =>
        l.bids?.some((b: any) => b.buyer_email === user.email || b.buyerEmail === user.email)
      );
      setMyBids(bidded);
    } catch {}
  };

  useEffect(() => {
    Promise.all([fetchProfile(), fetchListings(), fetchMyBids()])
      .finally(() => setLoading(false));
  }, []);

  // ✅ Save profile
  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, role: user.role, ...editData })
      });
      if (res.ok) {
        setProfile(editData);
        setEditing(false);
        toast.success("Profile updated!");
      } else {
        toast.error("Could not update profile");
      }
    } catch { toast.error("Error updating profile"); }
  };

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API}/user/${encodeURIComponent(user.email)}`, { method: "DELETE" });
      if (res.ok) {
        logout();
        navigate("/");
        toast.success("Account deleted");
      }
    } catch { toast.error("Could not delete account"); }
  };

  // ✅ Delete listing
  const handleDeleteListing = async (id: number) => {
    const res = await fetch(`${API}/listing/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Listing removed"); fetchListings(); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin text-4xl">🌾</div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* ── Profile Header Card ── */}
        <ScrollReveal>
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: user.role === "farmer" ? "#166534" : "#f59e0b" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
                    style={{
                      backgroundColor: user.role === "farmer" ? "#f0fdf4" : "#fffbeb",
                      color: user.role === "farmer" ? "#166534" : "#f59e0b"
                    }}>
                    {user.role === "farmer" ? "🧑‍🌾 Farmer" : user.role === "buyer" ? "🛒 Buyer" : "⚙️ Admin"}
                  </span>
                </div>
              </div>
              {/* Edit button */}
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-secondary transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={() => { setEditing(false); setEditData(profile); }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {/* ── Profile Details ── */}
            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                {user.role === "farmer" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {editing ? (
                        <input value={editData.phone || ""} onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className={inputClass} placeholder="Phone number" />
                      ) : (
                        <span className="text-sm">{profile.phone || "Not provided"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {editing ? (
                        <input value={editData.district || ""} onChange={(e) => setEditData({...editData, district: e.target.value})}
                          className={inputClass} placeholder="District" />
                      ) : (
                        <span className="text-sm">{profile.district ? `${profile.district}, ${profile.state}` : "Not provided"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base">🌾</span>
                      {editing ? (
                        <input value={editData.land_size || ""} onChange={(e) => setEditData({...editData, land_size: e.target.value})}
                          className={inputClass} placeholder="Land size (acres)" />
                      ) : (
                        <span className="text-sm">
                          {profile.has_land ? `${profile.land_size || "?"} acres` : "No land"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base">🏦</span>
                      <span className="text-sm text-muted-foreground">
                        {profile.bank_account ? `Bank: ****${profile.bank_account.slice(-4)}` : "Bank not added"}
                      </span>
                    </div>
                  </>
                )}

                {user.role === "buyer" && (
                  <>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {editing ? (
                        <input value={editData.phone || ""} onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className={inputClass} placeholder="Phone number" />
                      ) : (
                        <span className="text-sm">{profile.phone || "Not provided"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {editing ? (
                        <input value={editData.city || ""} onChange={(e) => setEditData({...editData, city: e.target.value})}
                          className={inputClass} placeholder="City" />
                      ) : (
                        <span className="text-sm">{profile.city ? `${profile.city}, ${profile.state}` : "Not provided"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {editing ? (
                        <input value={editData.company_name || ""} onChange={(e) => setEditData({...editData, company_name: e.target.value})}
                          className={inputClass} placeholder="Company name" />
                      ) : (
                        <span className="text-sm">
                          {profile.company_name || profile.business_type || "Individual buyer"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base">📄</span>
                      <span className="text-sm text-muted-foreground">
                        {profile.gst_number ? `GST: ${profile.gst_number}` : "GST not added"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── Farmer: My Listings ── */}
        {user.role === "farmer" && (
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" /> My Crop Listings ({listings.length})
              </h2>
              {listings.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No listings yet</p>
              ) : (
                <div className="space-y-3">
                  {listings.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                      <div>
                        <p className="font-semibold text-foreground">{l.crop}</p>
                        <p className="text-sm text-muted-foreground">
                          {l.quantity} quintals • ₹{l.price}/q • 📍{l.village}
                        </p>
                        <p className="text-xs mt-1">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            l.status === "open" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {l.status === "open" ? "Open" : "Sold"}
                          </span>
                          <span className="text-muted-foreground ml-2">{l.bids?.length || 0} bids</span>
                        </p>
                      </div>
                      <button onClick={() => handleDeleteListing(l.id)}
                        className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* ── Buyer: My Bid History ── */}
        {user.role === "buyer" && (
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> My Bid History ({myBids.length})
              </h2>
              {myBids.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No bids placed yet</p>
              ) : (
                <div className="space-y-3">
                  {myBids.map((listing) => {
                    const myBid = listing.bids
                      ?.filter((b: any) => b.buyer_email === user.email || b.buyerEmail === user.email)
                      ?.sort((a: any, b: any) => b.amount - a.amount)[0];
                    const highestBid = listing.bids?.length > 0
                      ? Math.max(...listing.bids.map((b: any) => b.amount))
                      : 0;
                    const iWon = listing.status === "sold" && myBid?.amount === highestBid;

                    return (
                      <div key={listing.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{listing.crop}</p>
                            <p className="text-sm text-muted-foreground">by {listing.name} • 📍{listing.village}</p>
                            <p className="text-sm mt-1">
                              My bid: <span className="font-semibold text-primary">₹{myBid?.amount?.toLocaleString()}</span>
                              <span className="text-muted-foreground ml-2">• Highest: ₹{highestBid.toLocaleString()}</span>
                            </p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            listing.status === "sold"
                              ? iWon ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                              : "bg-secondary text-secondary-foreground"
                          }`}>
                            {listing.status === "sold" ? (iWon ? "🏆 Won" : "❌ Lost") : "⏳ Open"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* ── Danger Zone ── */}
        <ScrollReveal>
          <div className="bg-card rounded-2xl border border-destructive/30 shadow-card p-6">
            <h2 className="text-lg font-semibold text-destructive mb-2">⚠️ Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, all your data will be permanently removed.
            </p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete My Account
              </button>
            ) : (
              <div className="flex gap-3 items-center">
                <p className="text-sm text-destructive font-medium">Are you sure?</p>
                <button onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl bg-destructive text-white text-sm font-medium hover:opacity-90">
                  Yes, Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default ProfilePage;
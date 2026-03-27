import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Users, Package, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API = "https://kisan-bandhu-production.up.railway.app";

const AdminPortal = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Admin access required.</p>
      </div>
    );
  }

  const fetchUsers = () => {
    fetch(`${API}/admin/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => toast.error("Could not load users"));
  };

  const fetchListings = () => {
    fetch(`${API}/farmers`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(() => toast.error("Could not load listings"));
  };

  useEffect(() => {
    fetchUsers();
    fetchListings();
  }, []);

  const handleRemove = async (id: number) => {
    const res = await fetch(`${API}/listing/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Listing removed");
      fetchListings();
    } else {
      toast.error("Could not remove listing");
    }
  };

  const totalBids = listings.reduce((sum, l) => sum + (l.bids?.length || 0), 0);
  const openListings = listings.filter(l => l.status === "open").length;
  const soldListings = listings.filter(l => l.status === "sold").length;

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: "Total Users", value: users.length },
    { icon: <Package className="w-6 h-6" />, label: "Total Listings", value: listings.length },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Total Bids", value: totalBids },
    { icon: <Package className="w-6 h-6" />, label: "Open / Sold", value: `${openListings} / ${soldListings}` },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-3xl font-bold text-foreground mb-1">⚙️ Admin Portal</h1>
          <p className="text-muted-foreground mb-8">Platform overview and management</p>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border shadow-card p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Registered Users</h2>
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                        No users registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* All Listings */}
        <h2 className="text-xl font-semibold text-foreground mb-4">All Crop Listings</h2>
        <div className="space-y-3">
          {listings.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No listings yet.</p>
          )}
          {listings.map((l) => (
            <div key={l.id} className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  {l.crop} <span className="text-sm text-muted-foreground">by {l.name}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {l.quantity} quintals • Base: ₹{l.price} • {l.bids?.length || 0} bids • {l.status}
                </p>
              </div>
              <button
                onClick={() => handleRemove(l.id)}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1 self-start">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
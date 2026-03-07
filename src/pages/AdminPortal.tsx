import { useAuth } from "@/context/AuthContext";
import { useMarket } from "@/context/MarketContext";
import ScrollReveal from "@/components/ScrollReveal";
import { Users, Package, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const AdminPortal = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { listings, removeListing } = useMarket();

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-lg">{t("adminAccessRequired")}</p></div>
  );
}

  const users = JSON.parse(localStorage.getItem("kisan_users") || "[]");
  const totalBids = listings.reduce((sum, l) => sum + l.bids.length, 0);
  const openListings = listings.filter((l) => l.status === "open").length;
  const soldListings = listings.filter((l) => l.status === "sold").length;

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: t("admin_statTotalUsers"), value: users.length },
    { icon: <Package className="w-6 h-6" />, label: t("admin_statTotalListings"), value: listings.length },
    { icon: <TrendingUp className="w-6 h-6" />, label: t("admin_statTotalBids"), value: totalBids },
    { icon: <Package className="w-6 h-6" />, label: t("admin_statOpenSold"), value: `${openListings} / ${soldListings}` },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-3xl font-bold text-foreground mb-1">{t("adminPortalTitle")}</h1>
          <p className="text-muted-foreground mb-8">{t("adminPortalDesc")}</p>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border shadow-card p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t("registeredUsers")}</h2>
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">{t("nameHeader")}</th>
                    <th className="text-left px-4 py-3 font-medium">{t("emailHeader")}</th>
                    <th className="text-left px-4 py-3 font-medium">{t("roleHeader")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any, i: number) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{u.role}</span></td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">{t("noUsersYet")}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* All Listings */}
        <h2 className="text-xl font-semibold text-foreground mb-4">{t("allCropListings")}</h2>
        <div className="space-y-3">
          {listings.map((l) => (
            <div key={l.id} className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{l.cropName} <span className="text-sm text-muted-foreground">{t("byLabel")} {l.farmerName}</span></h3>
                <p className="text-sm text-muted-foreground">{l.quantity} quintals • Base: ₹{l.basePrice} • {l.bids.length} {t("bidsSuffix")} • {t(l.status === "open" ? "status_Open" : "status_Sold" as any)}</p>
              </div>
              <button onClick={() => { removeListing(l.id); toast.success(t("listingRemoved")); }}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1 self-start">
                <Trash2 className="w-3.5 h-3.5" /> {t("removeBtn")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;

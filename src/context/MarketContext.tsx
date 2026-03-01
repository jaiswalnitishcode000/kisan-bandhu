import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Bid {
  buyerName: string;
  buyerEmail: string;
  amount: number;
  timestamp: number;
}

export interface CropListing {
  id: string;
  cropName: string;
  quantity: number;
  basePrice: number;
  imageUrl: string;
  farmerName: string;
  farmerEmail: string;
  bids: Bid[];
  status: "open" | "sold";
  cropType: string;
  createdAt: number;
}

interface MarketContextType {
  listings: CropListing[];
  addListing: (listing: Omit<CropListing, "id" | "bids" | "status" | "createdAt">) => void;
  placeBid: (listingId: string, bid: Bid) => void;
  acceptBid: (listingId: string) => void;
  removeListing: (listingId: string) => void;
}

const MarketContext = createContext<MarketContextType | null>(null);

export const useMarket = () => {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used within MarketProvider");
  return ctx;
};

// Seed data for demo
const seedListings: CropListing[] = [
  {
    id: "1", cropName: "Wheat", quantity: 50, basePrice: 2200, imageUrl: "",
    farmerName: "Ramesh Kumar", farmerEmail: "ramesh@demo.com",
    bids: [{ buyerName: "Sunil", buyerEmail: "sunil@demo.com", amount: 2400, timestamp: Date.now() - 3600000 }],
    status: "open", cropType: "grain", createdAt: Date.now() - 86400000,
  },
  {
    id: "2", cropName: "Rice (Basmati)", quantity: 30, basePrice: 3500, imageUrl: "",
    farmerName: "Sita Devi", farmerEmail: "sita@demo.com",
    bids: [{ buyerName: "Amit", buyerEmail: "amit@demo.com", amount: 3800, timestamp: Date.now() - 7200000 }],
    status: "open", cropType: "grain", createdAt: Date.now() - 172800000,
  },
  {
    id: "3", cropName: "Tomato", quantity: 20, basePrice: 1500, imageUrl: "",
    farmerName: "Mohan Lal", farmerEmail: "mohan@demo.com",
    bids: [], status: "open", cropType: "vegetable", createdAt: Date.now() - 43200000,
  },
  {
    id: "4", cropName: "Sugarcane", quantity: 100, basePrice: 3100, imageUrl: "",
    farmerName: "Ramesh Kumar", farmerEmail: "ramesh@demo.com",
    bids: [{ buyerName: "Priya", buyerEmail: "priya@demo.com", amount: 3300, timestamp: Date.now() - 1800000 }],
    status: "open", cropType: "cash_crop", createdAt: Date.now() - 259200000,
  },
];

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<CropListing[]>(() => {
    const saved = localStorage.getItem("kisan_listings");
    return saved ? JSON.parse(saved) : seedListings;
  });

  useEffect(() => {
    localStorage.setItem("kisan_listings", JSON.stringify(listings));
  }, [listings]);

  const addListing = (listing: Omit<CropListing, "id" | "bids" | "status" | "createdAt">) => {
    const newListing: CropListing = {
      ...listing,
      id: Date.now().toString(),
      bids: [],
      status: "open",
      createdAt: Date.now(),
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const placeBid = (listingId: string, bid: Bid) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, bids: [...l.bids, bid] } : l))
    );
  };

  const acceptBid = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: "sold" as const } : l))
    );
  };

  const removeListing = (listingId: string) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  };

  return (
    <MarketContext.Provider value={{ listings, addListing, placeBid, acceptBid, removeListing }}>
      {children}
    </MarketContext.Provider>
  );
};

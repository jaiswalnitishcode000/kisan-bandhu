import React, { createContext, useContext, ReactNode } from "react";

// ✅ Types - CropCard aur doosri jagah use hote hain
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

// ✅ Empty context - sab kuch ab backend se hota hai
interface MarketContextType {
  listings: CropListing[];
}

const MarketContext = createContext<MarketContextType | null>(null);

export const useMarket = () => {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used within MarketProvider");
  return ctx;
};

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MarketContext.Provider value={{ listings: [] }}>
      {children}
    </MarketContext.Provider>
  );
};
// Crop Advisory data - suggestions based on soil, season, and region
export interface CropSuggestion {
  name: string;
  expectedYield: string;
  estimatedProfit: string;
  waterRequirement: string;
}

interface AdvisoryMap {
  [key: string]: CropSuggestion[];
}

export const soilTypes = ["Alluvial", "Black (Regur)", "Red", "Laterite", "Sandy", "Clay"];
export const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
export const regions = ["North", "South", "East", "West", "Central", "North-East"];

// Simplified advisory logic
export function getCropSuggestions(soil: string, season: string, region: string): CropSuggestion[] {
  const suggestions: CropSuggestion[] = [];

  if (season.includes("Kharif")) {
    suggestions.push(
      { name: "Rice", expectedYield: "25-30 quintals/hectare", estimatedProfit: "₹45,000-60,000", waterRequirement: "High" },
      { name: "Cotton", expectedYield: "15-20 quintals/hectare", estimatedProfit: "₹50,000-70,000", waterRequirement: "Medium" },
      { name: "Maize", expectedYield: "30-40 quintals/hectare", estimatedProfit: "₹35,000-50,000", waterRequirement: "Medium" },
    );
  } else if (season.includes("Rabi")) {
    suggestions.push(
      { name: "Wheat", expectedYield: "30-45 quintals/hectare", estimatedProfit: "₹55,000-80,000", waterRequirement: "Medium" },
      { name: "Mustard", expectedYield: "10-15 quintals/hectare", estimatedProfit: "₹40,000-55,000", waterRequirement: "Low" },
      { name: "Chickpea (Chana)", expectedYield: "12-18 quintals/hectare", estimatedProfit: "₹45,000-65,000", waterRequirement: "Low" },
    );
  } else {
    suggestions.push(
      { name: "Watermelon", expectedYield: "200-300 quintals/hectare", estimatedProfit: "₹60,000-90,000", waterRequirement: "High" },
      { name: "Cucumber", expectedYield: "100-150 quintals/hectare", estimatedProfit: "₹40,000-60,000", waterRequirement: "Medium" },
      { name: "Moong Dal", expectedYield: "8-12 quintals/hectare", estimatedProfit: "₹35,000-50,000", waterRequirement: "Low" },
    );
  }

  // Add soil-specific suggestions
  if (soil === "Black (Regur)") {
    suggestions.push({ name: "Soybean", expectedYield: "15-20 quintals/hectare", estimatedProfit: "₹40,000-55,000", waterRequirement: "Medium" });
  }
  if (soil === "Alluvial") {
    suggestions.push({ name: "Sugarcane", expectedYield: "600-800 quintals/hectare", estimatedProfit: "₹1,50,000-2,00,000", waterRequirement: "High" });
  }

  return suggestions;
}

// MSP Data (2024-25 approximate)
export const mspData: Record<string, number> = {
  "Wheat": 2275,
  "Rice": 2203,
  "Maize": 2090,
  "Cotton": 7020,
  "Sugarcane": 315,
  "Mustard": 5650,
  "Chickpea (Chana)": 5440,
  "Soybean": 4892,
  "Moong Dal": 8558,
  "Jowar": 3180,
  "Bajra": 2500,
  "Groundnut": 6377,
};

// Government schemes data
export interface GovScheme {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  icon: string;
  link: string;
}

export const govSchemes: (GovScheme & { id: string })[] = [
  {
    id: "PMKISAN",
    name: "PM-KISAN",
    description: "Direct income support of ₹6,000 per year to farmer families in three equal installments.",
    eligibility: "All land-holding farmer families with cultivable land.",
    benefits: "₹6,000/year direct bank transfer, no middlemen involved.",
    icon: "💰",
    link: "https://pmkisan.gov.in/"
  },
  {
    id: "PMFasal",
    name: "PM Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support against crop loss due to natural calamities.",
    eligibility: "All farmers growing notified crops in notified areas.",
    benefits: "Low premium rates: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops.",
    icon: "🛡️",
    link: "https://pmfby.gov.in/"
  },
  {
    id: "SoilHealth",
    name: "Soil Health Card Scheme",
    description: "Provides soil health cards with crop-wise nutrient recommendations to farmers.",
    eligibility: "All farmers across India.",
    benefits: "Free soil testing, personalized fertilizer recommendations, improved yield.",
    icon: "🌱",
    link: "https://soilhealth.dac.gov.in/"
  },
  {
    id: "KCC",
    name: "Kisan Credit Card (KCC)",
    description: "Provides affordable credit to farmers for cultivation, post-harvest, and consumption needs.",
    eligibility: "Farmers, fishermen, and animal husbandry farmers.",
    benefits: "Credit up to ₹3 lakh at 4% interest, crop insurance coverage included.",
    icon: "💳",
    link: "https://pmkisan.gov.in/Documents/Kcc.pdf"
  },
  {
    id: "eNAM",
    name: "e-NAM (National Agriculture Market)",
    description: "Online trading platform for agricultural commodities to ensure better prices for farmers.",
    eligibility: "Registered farmers and traders.",
    benefits: "Transparent price discovery, reduced middlemen, wider market access.",
    icon: "📈",
    link: "https://www.enam.gov.in/"
  },
  {
    id: "PMKrishi",
    name: "PM Krishi Sinchai Yojana",
    description: "Ensures access to water for irrigation with 'Har Khet Ko Pani' initiative.",
    eligibility: "All farmers with focus on water-scarce areas.",
    benefits: "Subsidized micro-irrigation, drip irrigation systems, water harvesting support.",
    icon: "💧",
    link: "https://pmksy.gov.in/"
  },
  {
  id: "KUSUM",
  name: "PM KUSUM Yojana",
  description: "Supports farmers to install solar pumps and generate additional income.",
  eligibility: "Farmers with land and existing irrigation pumps.",
  benefits: "Up to 60% subsidy, reduced electricity cost, income from solar power.",
  icon: "☀️",
  link: "https://pmkusum.mnre.gov.in"
},
{
  id: "AIF",
  name: "Agriculture Infrastructure Fund",
  description: "Provides financing for warehouses, cold storage, and agricultural infrastructure.",
  eligibility: "Farmers, FPOs, agri startups, cooperatives.",
  benefits: "Low interest loans, credit guarantee, infrastructure development support.",
  icon: "🏗️",
  link: "https://agriinfra.dac.gov.in"
},
{
  id: "BEE",
  name: "National Beekeeping & Honey Mission",
  description: "Promotes beekeeping and honey production for additional farmer income.",
  eligibility: "Farmers interested in apiculture and allied activities.",
  benefits: "Training, financial support, increased income opportunities.",
  icon: "🐝",
  link: "https://nbb.gov.in"
}
];

import dotenvConfig from "../utils/dotenvConfig.js";
import connectDB from "../config/db.js";
import Stock from "../models/Stock.js";

dotenvConfig();

const companies = [
  { rank: 1, name: "NVIDIA Corporation", symbol: "NVDA" },
  { rank: 2, name: "Apple Inc.", symbol: "AAPL" },
  { rank: 3, name: "Alphabet Inc.", symbol: "GOOGL" },
  { rank: 4, name: "Microsoft Corporation", symbol: "MSFT" },
  { rank: 5, name: "Amazon.com Inc.", symbol: "AMZN" },
  { rank: 6, name: "Broadcom Inc.", symbol: "AVGO" },
  { rank: 7, name: "Meta Platforms Inc.", symbol: "META" },
  { rank: 8, name: "Tesla Inc.", symbol: "TSLA" },
  { rank: 9, name: "Berkshire Hathaway Inc.", symbol: "BRK-B" },
  { rank: 10, name: "Walmart Inc.", symbol: "WMT" },
  { rank: 11, name: "Eli Lilly and Company", symbol: "LLY" },
  { rank: 12, name: "JPMorgan Chase & Co.", symbol: "JPM" },
  { rank: 13, name: "Visa Inc.", symbol: "V" },
  { rank: 14, name: "Oracle Corporation", symbol: "ORCL" },
  { rank: 15, name: "Mastercard Incorporated", symbol: "MA" },
  { rank: 16, name: "Johnson & Johnson", symbol: "JNJ" },
  { rank: 17, name: "Exxon Mobil Corporation", symbol: "XOM" },
  { rank: 18, name: "Palantir Technologies Inc.", symbol: "PLTR" },
  { rank: 19, name: "Bank of America Corporation", symbol: "BAC" },
  { rank: 20, name: "Netflix Inc.", symbol: "NFLX" },
  { rank: 21, name: "AbbVie Inc.", symbol: "ABBV" },
  { rank: 22, name: "Costco Wholesale Corporation", symbol: "COST" },
  { rank: 23, name: "The Home Depot Inc.", symbol: "HD" },
  { rank: 24, name: "Advanced Micro Devices Inc.", symbol: "AMD" },
  { rank: 25, name: "The Procter & Gamble Company", symbol: "PG" },
  { rank: 26, name: "GE Aerospace", symbol: "GE" },
  { rank: 27, name: "UnitedHealth Group Incorporated", symbol: "UNH" },
  { rank: 28, name: "Cisco Systems Inc.", symbol: "CSCO" },
  { rank: 29, name: "The Coca-Cola Company", symbol: "KO" },
  { rank: 30, name: "Chevron Corporation", symbol: "CVX" },
  { rank: 31, name: "Wells Fargo & Company", symbol: "WFC" },
  { rank: 32, name: "International Business Machines", symbol: "IBM" },
  { rank: 33, name: "Morgan Stanley", symbol: "MS" },
  { rank: 34, name: "Caterpillar Inc.", symbol: "CAT" },
  { rank: 35, name: "Micron Technology Inc.", symbol: "MU" },
  { rank: 36, name: "The Goldman Sachs Group Inc.", symbol: "GS" },
  { rank: 37, name: "American Express Company", symbol: "AXP" },
  { rank: 38, name: "Merck & Co. Inc.", symbol: "MRK" },
  { rank: 39, name: "Salesforce Inc.", symbol: "CRM" },
  { rank: 40, name: "RTX Corporation", symbol: "RTX" },
  { rank: 41, name: "Philip Morris International Inc.", symbol: "PM" },
  { rank: 42, name: "AppLovin Corporation", symbol: "APP" },
  { rank: 43, name: "McDonald's Corporation", symbol: "MCD" },
  { rank: 44, name: "T-Mobile US Inc.", symbol: "TMUS" },
  { rank: 45, name: "Abbott Laboratories", symbol: "ABT" },
  { rank: 46, name: "Thermo Fisher Scientific Inc.", symbol: "TMO" },
  { rank: 47, name: "Applied Materials Inc.", symbol: "AMAT" },
  { rank: 48, name: "PepsiCo Inc.", symbol: "PEP" },
  { rank: 49, name: "Citigroup Inc.", symbol: "C" },
  { rank: 50, name: "Lam Research Corporation", symbol: "LRCX" }
];

const seedStocks = async () => {
  try {
    await connectDB();
    await Stock.deleteMany();
    await Stock.insertMany(companies);
    console.log("✅ Stocks seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding stocks:", error);
    process.exit(1);
  }
};

seedStocks();

import dotenvConfig from "../utils/dotenvConfig.js";
import connectDB from "../config/db.js";
import Stock from "../models/Stock.js";

dotenvConfig();

const companies = [
  { rank: 1, name: "NVIDIA", symbol: "NVDA", type: "stock" },
  { rank: 2, name: "Apple", symbol: "AAPL", type: "stock" },
  { rank: 3, name: "Microsoft", symbol: "MSFT", type: "stock" },
  { rank: 4, name: "Alphabet", symbol: "GOOGL", type: "stock" },
  { rank: 5, name: "Amazon", symbol: "AMZN", type: "stock" },
  { rank: 6, name: "Meta", symbol: "META", type: "stock" },
  { rank: 7, name: "Tesla", symbol: "TSLA", type: "stock" },
  { rank: 8, name: "Netflix", symbol: "NFLX", type: "stock" },
  { rank: 9, name: "JPMorgan", symbol: "JPM", type: "stock" },
  { rank: 10, name: "Visa", symbol: "V", type: "stock" },
  { rank: 11, name: "Mastercard", symbol: "MA", type: "stock" },
  { rank: 12, name: "AMD", symbol: "AMD", type: "stock" },
  { rank: 13, name: "Intel", symbol: "INTC", type: "stock" },
  { rank: 14, name: "IBM", symbol: "IBM", type: "stock" },
  { rank: 15, name: "Coca-Cola", symbol: "KO", type: "stock" },
  { rank: 16, name: "PepsiCo", symbol: "PEP", type: "stock" },
  { rank: 17, name: "Walmart", symbol: "WMT", type: "stock" },
  { rank: 18, name: "Costco", symbol: "COST", type: "stock" },
  { rank: 19, name: "Exxon Mobil", symbol: "XOM", type: "stock" },
  { rank: 20, name: "Chevron", symbol: "CVX", type: "stock" },
  { rank: 21, name: "Palantir", symbol: "PLTR", type: "stock" },
  { rank: 22, name: "Salesforce", symbol: "CRM", type: "stock" },
  { rank: 23, name: "Oracle", symbol: "ORCL", type: "stock" },
  { rank: 24, name: "McDonald's", symbol: "MCD", type: "stock" },
  { rank: 25, name: "Berkshire Hathaway", symbol: "BRK-B", type: "stock" },
  { rank: 26, name: "USD / TRY", symbol: "USDTRY=X", type: "forex" },
  { rank: 27, name: "EUR / TRY", symbol: "EURTRY=X", type: "forex" },
  { rank: 28, name: "EUR / USD", symbol: "EURUSD=X", type: "forex" },
  { rank: 29, name: "GBP / USD", symbol: "GBPUSD=X", type: "forex" },
  { rank: 30, name: "USD / JPY", symbol: "USDJPY=X", type: "forex" },
  { rank: 31, name: "USD / CHF", symbol: "USDCHF=X", type: "forex" },
  { rank: 32, name: "AUD / USD", symbol: "AUDUSD=X", type: "forex" },
  { rank: 33, name: "USD / CAD", symbol: "USDCAD=X", type: "forex" },
  { rank: 34, name: "Gold", symbol: "GC=F", type: "commodity" },
  { rank: 35, name: "Silver", symbol: "SI=F", type: "commodity" },
  { rank: 36, name: "Platinum", symbol: "PL=F", type: "commodity" },
  { rank: 37, name: "Palladium", symbol: "PA=F", type: "commodity" },
  { rank: 38, name: "Copper", symbol: "HG=F", type: "commodity" },
  { rank: 39, name: "Brent Oil", symbol: "BZ=F", type: "commodity" },
  { rank: 40, name: "Bitcoin", symbol: "BTC-USD", type: "crypto" },
  { rank: 41, name: "Ethereum", symbol: "ETH-USD", type: "crypto" },
  { rank: 42, name: "BNB", symbol: "BNB-USD", type: "crypto" },
  { rank: 43, name: "Solana", symbol: "SOL-USD", type: "crypto" },
  { rank: 44, name: "XRP", symbol: "XRP-USD", type: "crypto" },
  { rank: 45, name: "Cardano", symbol: "ADA-USD", type: "crypto" },
  { rank: 46, name: "S&P 500", symbol: "^GSPC", type: "index" },
  { rank: 47, name: "NASDAQ", symbol: "^IXIC", type: "index" },
  { rank: 48, name: "Dow Jones", symbol: "^DJI", type: "index" },
  { rank: 49, name: "DAX", symbol: "^GDAXI", type: "index" },
  { rank: 50, name: "BIST 100", symbol: "XU100.IS", type: "index" },
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

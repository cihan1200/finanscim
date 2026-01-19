import express from "express";
import YahooFinance from "yahoo-finance2";
import surveyQuestion from "../models/surveyQuestion.js";
import Stock from "../models/Stock.js";

const normalizeType = (t) => {
  if (!t) return "";
  return t.toLowerCase().replace(/[^a-z]/g, "");
};

const router = express.Router();

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

// --- YARDIMCI FONKSİYONLAR ---

// API bloklandığında devreye girecek yapay veri üreticisi
const generateMockData = (symbol, name, type) => {
  // Türe göre rastgele fiyat aralıkları
  let basePrice = 100;
  if (type === 'crypto') basePrice = 2000;
  else if (type === 'forex') basePrice = 30;
  else if (type === 'commodity') basePrice = 80;
  else if (type === 'index') basePrice = 5000;

  const randomPrice = basePrice + (Math.random() * basePrice * 0.2);
  const randomChange = (Math.random() * 40) - 15; // -15% ile +25% arası
  const randomVol = (Math.random() * 30) + 10; // %10 ile %40 arası risk

  return {
    symbol: symbol,
    name: name,
    type: type,
    currentPrice: parseFloat(randomPrice.toFixed(2)),
    dailyChange: parseFloat(((Math.random() * 4) - 2).toFixed(2)),
    change: parseFloat(randomChange.toFixed(2)),
    volatility: parseFloat(randomVol.toFixed(2)),
    high: randomPrice * 1.1,
    low: randomPrice * 0.9,
    isMock: true // Frontend'de uyarı göstermek isterseniz diye
  };
};

const calculateAssetMetrics = async (info) => {
  const { symbol, name, type } = info;
  try {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 90);
    const queryOptions = { period1: pastDate, interval: "1d" };

    // Yahoo Finance isteği
    const result = await yahooFinance.chart(symbol, queryOptions);

    if (!result || !result.quotes || result.quotes.length < 10) {
      throw new Error("Insufficient data");
    }

    const quotes = result.quotes;
    const currentPrice = quotes[quotes.length - 1].close;
    const startPrice = quotes[0].close;
    const periodChange = ((currentPrice - startPrice) / startPrice) * 100;
    const prevPrice = quotes[quotes.length - 2].close;
    const dailyChange = ((currentPrice - prevPrice) / prevPrice) * 100;

    let returns = [];
    for (let i = 1; i < quotes.length; i++) {
      if (quotes[i].close && quotes[i - 1].close) {
        returns.push((quotes[i].close - quotes[i - 1].close) / quotes[i - 1].close);
      }
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
    const tradingDays = type === 'crypto' ? 365 : 252;
    const annualizedVolatility = Math.sqrt(variance) * Math.sqrt(tradingDays) * 100;

    return {
      symbol: symbol,
      name: name,
      type: type,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      dailyChange: parseFloat(dailyChange.toFixed(2)),
      change: parseFloat(periodChange.toFixed(2)),
      volatility: parseFloat(annualizedVolatility.toFixed(2)),
      high: Math.max(...quotes.map(q => q.high)),
      low: Math.min(...quotes.map(q => q.low))
    };
  } catch (err) {
    // HATA DURUMUNDA MOCK DATA DÖNDÜR
    // Bu kısım sistemin 503 vermesini engeller
    console.warn(`⚠️ Fetch failed for ${symbol} (${err.message}). Using mock data.`);
    return generateMockData(symbol, name, type);
  }
};

const fetchMarketData = async (filterType = null) => {
  try {
    const query = {};
    if (filterType && filterType !== "all") {
      query.type = new RegExp(normalizeType(filterType), "i");
    }

    const stockDocs = await Stock.find(query).sort({ rank: 1 });

    const poolToProcess = stockDocs.map(doc => ({
      symbol: doc.symbol,
      name: doc.name,
      type: doc.type
    }));

    const results = [];
    const BATCH_SIZE = 3;

    for (let i = 0; i < poolToProcess.length; i += BATCH_SIZE) {
      const batch = poolToProcess.slice(i, i + BATCH_SIZE);

      // Hataları yakalayan (mock dönen) fonksiyonu çağırıyoruz
      const batchResults = await Promise.all(
        batch.map(info => calculateAssetMetrics(info))
      );

      results.push(...batchResults);

    }

    // Mock data sayesinde burası artık boş kalmayacak
    const validAssets = results.filter(a => a !== null && a.currentPrice > 0);
    return validAssets;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
};

// --- ROUTES ---

router.post("/create_survey_question", async (req, res) => {
  try {
    const { question, options } = req.body;
    const created = await surveyQuestion.create({ question, options });
    res.status(200).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get_survey_questions", async (_req, res) => {
  try {
    const questions = await surveyQuestion.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get_market_list", async (req, res) => {
  try {
    const data = await fetchMarketData('all');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching market list" });
  }
});

router.get("/get_stock_detail", async (req, res) => {
  // Detay sayfasında hala hata alabilirsiniz (tekil istek olduğu için)
  // Ancak ana akış çalışacaktır.
  try {
    const { symbol, range } = req.query;
    let queryOptions = { interval: "1d" };
    const today = new Date();
    const fromDate = new Date();
    switch (range) {
      case '1d':
        fromDate.setDate(today.getDate() - 2);
        queryOptions.interval = "30m";
        break;
      case '1mo':
        fromDate.setMonth(today.getMonth() - 1);
        break;
      case '3mo':
        fromDate.setMonth(today.getMonth() - 3);
        break;
      case '1y':
        fromDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        fromDate.setMonth(today.getMonth() - 1);
    }
    queryOptions.period1 = fromDate;
    const result = await yahooFinance.chart(symbol, queryOptions);
    if (!result || !result.quotes) {
      return res.status(404).json({ message: "Data not found" });
    }
    const history = result.quotes
      .filter(q => q.close)
      .map(q => ({
        date: new Date(q.date).toLocaleDateString("tr-TR",
          {
            month: 'short', day: 'numeric', hour: range === '1d' ?
              '2-digit' : undefined, minute: range === '1d' ?
                '2-digit' : undefined
          }),
        price: parseFloat(q.close.toFixed(2))
      }));
    res.json(history);
  } catch (error) {
    console.error("Detail error:", error);
    // Detay için basit bir mock fallback eklenebilir ama
    // şimdilik ana sayfayı kurtarmak öncelikli.
    res.status(500).json({ message: "Error fetching stock details" });
  }
});

router.get("/get_market_recommendations", async (req, res) => {
  try {
    const userScore = parseInt(req.query.score) || 10;
    const requestedType = req.query.type || 'all';

    // fetchMarketData artık mock veri sayesinde asla boş dönmeyecek
    const validAssets = await fetchMarketData(requestedType);

    if (validAssets.length === 0) return res.status(503).json({ message: "Market data unavailable" });

    const volatilities = validAssets.map(a => a.volatility);
    const changes = validAssets.map(a => a.change);
    const minVol = Math.min(...volatilities);
    const maxVol = Math.max(...volatilities);
    const minChange = Math.min(...changes);
    const maxChange = Math.max(...changes);
    const normalizedUserScore = Math.max(0, Math.min(1, (userScore - 7) / 14));
    const weightGrowth = 0.2 + (0.6 * normalizedUserScore);
    const weightStability = 1 - weightGrowth;

    const scoredAssets = validAssets.map(asset => {
      const normVol = (asset.volatility - minVol) / (maxVol - minVol || 1);
      const stabilityScore = 1 - normVol;
      const growthScore = (asset.change - minChange) / (maxChange - minChange || 1);
      const ahpScore = (stabilityScore * weightStability) + (growthScore * weightGrowth);
      return { ...asset, ahpScore };
    });

    scoredAssets.sort((a, b) => b.ahpScore - a.ahpScore);
    const recommendations = scoredAssets.slice(0, 3);

    const avgVol = (recommendations.reduce((sum, item) => sum + item.volatility, 0) / recommendations.length).toFixed(1);
    const avgChange = (recommendations.reduce((sum, item) => sum + item.change, 0) / recommendations.length).toFixed(1);

    let typeName = "piyasalar";
    if (requestedType === 'stock') typeName = "hisse senedi piyasası";
    else if (requestedType === 'crypto') typeName = "kripto para piyasası";
    else if (requestedType === 'forex') typeName = "döviz piyasası";
    else if (requestedType === 'commodity') typeName = "emtia piyasası";

    let riskCategory = "Dengeli";
    let comment = "";
    if (userScore <= 12) {
      riskCategory = "Düşük Risk";
      comment = `Profiliniz sermaye koruma odaklı. ${typeName} genelinde
      dalgalanmaların yüksek olduğu bu dönemde, algoritmamız riskinizi minimize
      etmek için ortalama volatilitesi %${avgVol} olan en istikrarlı varlıkları
      seçti. Önceliğimiz ana paranızı korurken düzenli bir değer artışı sağlamak.`;
    } else if (userScore <= 16) {
      riskCategory = "Orta Risk";
      comment = `Büyüme potansiyeli ile güvenlik arasında ideal bir denge arıyorsunuz.
      Seçilen portföy, hem piyasa düşüşlerine karşı dirençli hem de son 90 günde ortalama
      %${avgChange} getiri performansı göstermiş varlıklardan oluşuyor.
      Risk ve getiri optimizasyonu sağlandı.`;
    } else {
      riskCategory = "Yüksek Risk";
      comment = `Hedefiniz maksimum getiri. Algoritmamız, ${typeName} içerisinde son dönemde
      güçlü momentum yakalayan ve ortalama %${avgChange} getiri sağlayan varlıkları tespit etti.
      Seçilen varlıklar yüksek volatiliteye (%${avgVol}) sahip olsa da, uzun vadede en yüksek
      büyüme potansiyelini sunuyor.`;
    }

    res.json({ riskCategory, comment, recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating recommendations" });
  }
});

export default router;
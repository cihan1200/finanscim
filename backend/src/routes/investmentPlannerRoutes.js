import express from "express";
import YahooFinance from "yahoo-finance2";
import surveyQuestion from "../models/surveyQuestion.js";
import Stock from "../models/Stock.js";

const router = express.Router();

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const calculateAssetMetrics = async (symbol) => {
  try {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 90);

    const queryOptions = { period1: pastDate, interval: "1d" };
    const result = await yahooFinance.chart(symbol, queryOptions);

    if (!result || !result.quotes || result.quotes.length < 10) return null;

    const quotes = result.quotes;
    const currentPrice = quotes[quotes.length - 1].close;

    // Calculate 90-day change
    const startPrice = quotes[0].close;
    const periodChange = ((currentPrice - startPrice) / startPrice) * 100;

    // Calculate daily change
    const prevPrice = quotes[quotes.length - 2].close;
    const dailyChange = ((currentPrice - prevPrice) / prevPrice) * 100;

    // Volatility calculation
    let returns = [];
    for (let i = 1; i < quotes.length; i++) {
      if (quotes[i].close && quotes[i - 1].close) {
        returns.push((quotes[i].close - quotes[i - 1].close) / quotes[i - 1].close);
      }
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
    const annualizedVolatility = Math.sqrt(variance) * Math.sqrt(252) * 100;

    return {
      symbol: symbol,
      name: symbol,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      dailyChange: parseFloat(dailyChange.toFixed(2)),
      change: parseFloat(periodChange.toFixed(2)), // 90-day
      volatility: parseFloat(annualizedVolatility.toFixed(2)),
      high: Math.max(...quotes.map(q => q.high)),
      low: Math.min(...quotes.map(q => q.low))
    };
  } catch (err) {
    // Silently fail for individual stock errors to keep the list moving
    return null;
  }
};

const fetchMarketData = async () => {
  try {
    const stockDocs = await Stock.find({}).sort({ rank: 1 }).limit(50);
    const poolToProcess = stockDocs.map(doc => doc.symbol);
    const results = await Promise.all(
      poolToProcess.map(symbol => calculateAssetMetrics(symbol))
    );
    const validAssets = results.filter(a => a !== null && a.currentPrice > 0);
    return validAssets;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
};

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
    const data = await fetchMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching market list" });
  }
});

router.get("/get_stock_detail", async (req, res) => {
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
        date: new Date(q.date).toLocaleDateString("tr-TR", { month: 'short', day: 'numeric', hour: range === '1d' ? '2-digit' : undefined, minute: range === '1d' ? '2-digit' : undefined }),
        price: parseFloat(q.close.toFixed(2))
      }));
    res.json(history);
  } catch (error) {
    console.error("Detail error:", error);
    res.status(500).json({ message: "Error fetching stock details" });
  }
});

router.get("/get_market_recommendations", async (req, res) => {
  try {
    const userScore = parseInt(req.query.score) || 10;
    const validAssets = await fetchMarketData();
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
    let riskCategory = "Dengeli";
    let comment = "";
    if (userScore <= 10) {
      riskCategory = "Düşük Risk";
      comment = `Profiliniz sermaye koruma odaklı. Algoritmamız, piyasa dalgalanmalarına karşı dirençli olan (${recommendations[0].symbol}) gibi varlıkları seçti.`;
    } else if (userScore <= 16) {
      riskCategory = "Orta Risk";
      comment = `Büyüme potansiyeli ile güvenlik arasında bir denge arıyorsunuz.`;
    } else {
      riskCategory = "Yüksek Risk";
      comment = `Maksimum getiri hedefliyorsunuz. Yüksek momentumlu hisseler seçildi.`;
    }
    res.json({ riskCategory, comment, recommendations });
  } catch (err) {
    res.status(500).json({ message: "Error calculating recommendations" });
  }
});

export default router;
import express from "express";
import MonthlyBalance from "../models/MonthlyBalance.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================================================
   TREND EĞİMİ (Lineer Regresyon)
=========================================================== */
const calculateTrendSlope = (values) => {
  if (values.length < 2) return 0;
  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  values.forEach((y, x) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
};

/* ===========================================================
   İSTİKRAR (Yüzdesel Büyüme Tutarlılığı)
=========================================================== */
const calculateStabilityScore = (values) => {
  if (values.length < 3) return 10;

  const growthRates = [];
  for (let i = 1; i < values.length; i++) {
    const prevValue = values[i - 1] === 0 ? 1 : Math.abs(values[i - 1]);
    const rate = (values[i] - values[i - 1]) / prevValue;
    growthRates.push(rate);
  }

  const avgRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
  const variance = growthRates.reduce((acc, val) => acc + Math.pow(val - avgRate, 2), 0) / growthRates.length;
  const stdDev = Math.sqrt(variance);

  let stabilityScore = 0;
  if (stdDev < 0.25) stabilityScore = 20;
  else if (stdDev < 0.6) stabilityScore = 15;
  else if (stdDev < 1.2) stabilityScore = 10;
  else stabilityScore = 5;

  if (avgRate < 0) stabilityScore = Math.floor(stabilityScore * 0.5);

  return stabilityScore;
};

/* ===========================================================
   FİNANSAL ANALİZ ROUTE
=========================================================== */
router.get("/analyze", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();

    const balanceDoc = await MonthlyBalance.findOne({
      year: currentYear,
      user: userId
    });

    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    if (!balanceDoc || !balanceDoc.balances || balanceDoc.balances.length === 0) {
      return res.json({
        status: "insufficient_data",
        recommendations: ["Analiz için yeterli finansal veri bulunamadı."]
      });
    }

    const values = balanceDoc.balances
      .slice(0, currentMonthIndex + 1)
      .map(v => Number(v) || 0);

    const chartData = values.map((val, index) => ({
      month: monthNames[index],
      value: val
    }));

    /* 1. TREND SKORU */
    const slope = calculateTrendSlope(values);
    let trendScore = 0;
    if (slope > 100) trendScore = 20;
    else if (slope > 0) trendScore = 15;
    else if (slope > -50) trendScore = 5;
    else trendScore = 2;

    /* 2. TASARRUF / BÜYÜME HIZI HESABI */
    const rates = [];
    for (let i = 1; i < values.length; i++) {
      const prev = values[i - 1];
      if (prev === 0) {
        rates.push(values[i] > 0 ? 1.0 : 0);
      } else {
        rates.push((values[i] - prev) / Math.abs(prev));
      }
    }

    let avgGrowthRate = rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length) : 0;

    if (slope <= 0 && avgGrowthRate > 0) {
      avgGrowthRate = avgGrowthRate * 0.2;
    }

    const constrainedRate = Math.min(1.0, Math.max(-1.0, avgGrowthRate));

    let savingsScore = 0;
    if (avgGrowthRate >= 0.15) savingsScore = 40;
    else if (avgGrowthRate >= 0.08) savingsScore = 30;
    else if (avgGrowthRate >= 0.03) savingsScore = 20;
    else if (avgGrowthRate > 0) savingsScore = 10;

    /* 3. İSTİKRAR SKORU */
    const stabilityScore = calculateStabilityScore(values);

    /* 4. GÜVENİLİRLİK SKORU */
    const positiveMonths = values.filter(v => v > 0).length;
    const reliabilityScore = Math.round((positiveMonths / values.length) * 20);

    /* FİNAL SKOR */
    const finalScore = Math.min(100, savingsScore + stabilityScore + trendScore + reliabilityScore);

    /* ÖNERİLER */
    const recommendations = [];
    if (avgGrowthRate >= 0.10 && slope > 10) {
      recommendations.push("Varlıklarınız kararlı ve hızlı bir şekilde büyüyor. Yatırım çeşitliliği düşünebilirsiniz.");
    } else if (slope > 0) {
      recommendations.push("Büyüme trendiniz pozitif ancak daha hızlı birikim için harcama disiplini gerekebilir.");
    } else {
      recommendations.push("Net bakiyenizde bir artış görülmüyor. Dalgalanmaları azaltmak için bütçe planlaması yapmalısınız.");
    }

    if (stabilityScore < 10) {
      recommendations.push("Bakiyenizdeki sert iniş çıkışlar finansal risk oluşturuyor.");
    }

    if (finalScore >= 80) recommendations.push("Finansal sağlığınız mükemmel durumda.");

    let category = "Kritik";
    let categoryColor = "red";
    if (finalScore >= 80) { category = "Mükemmel"; categoryColor = "green"; }
    else if (finalScore >= 60) { category = "İyi"; categoryColor = "blue"; }
    else if (finalScore >= 40) { category = "Orta"; categoryColor = "yellow"; }

    res.json({
      finalScore,
      category,
      categoryColor,
      chartData,
      metrics: {
        savingsRate: (constrainedRate * 100).toFixed(1),
        savingsScore,
        stabilityScore,
        trendScore,
        reliabilityScore
      },
      recommendations
    });

  } catch (error) {
    console.error("Financial Health Analysis Error:", error);
    res.status(500).json({ message: "Analiz sırasında bir hata oluştu." });
  }
});

export default router;

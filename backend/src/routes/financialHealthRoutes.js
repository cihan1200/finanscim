import express from "express";
import MonthlyBalance from "../models/MonthlyBalance.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================================================
   TREND EĞİMİ
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
   İSTİKRAR (Stability)
=========================================================== */
const calculateStabilityScore = (values) => {
  if (values.length < 3) return 10;

  const diffs = [];
  for (let i = 1; i < values.length; i++) {
    diffs.push(values[i] - values[i - 1]);
  }

  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;

  const variance =
    diffs.reduce((acc, val) => acc + Math.pow(val - avgDiff, 2), 0) /
    (diffs.length - 1);

  const stdDev = Math.sqrt(variance);
  const cv = Math.abs(avgDiff) !== 0 ? Math.abs(stdDev / avgDiff) : 1;

  let stabilityScore = 0;
  if (cv < 0.1) stabilityScore = 20;
  else if (cv < 0.3) stabilityScore = 15;
  else if (cv < 0.6) stabilityScore = 10;
  else if (cv < 1.0) stabilityScore = 5;
  else stabilityScore = 2;

  const slope = calculateTrendSlope(values);
  if (slope < 0) stabilityScore = Math.floor(stabilityScore * 0.5);

  return stabilityScore;
};

/* ===========================================================
   ANALİZ
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

    let chartData = [];

    if (balanceDoc && balanceDoc.balances) {
      const dataToProcess = balanceDoc.balances.slice(0, currentMonthIndex + 1);
      chartData = dataToProcess.map((val, index) => ({
        month: monthNames[index],
        value: Number(val) || 0
      }));
    }

    const values = chartData.map(d => d.value);

    if (values.length === 0) {
      return res.json({
        status: "insufficient_data",
        recommendations: ["Analiz için yeterli finansal veri bulunamadı."]
      });
    }

    /* ===========================================================
       ✔ TASARRUF ORANI — SADECE NET BAKİYE İLE
       Tasarruf = Aylık ortalama artış / Ortalama bakiye
    ============================================================ */

    const diffs = [];
    for (let i = 1; i < values.length; i++) {
      diffs.push(values[i] - values[i - 1]);
    }

    const avgMonthlyChange = diffs.length
      ? diffs.reduce((a, b) => a + b, 0) / diffs.length
      : 0;

    const avgBalance =
      values.reduce((a, b) => a + b, 0) / values.length;

    const savingsRate =
      avgBalance > 0 ? Math.min(avgMonthlyChange / avgBalance, 1) : 0;

    let savingsScore = 0;
    if (savingsRate >= 0.5) savingsScore = 40;
    else if (savingsRate >= 0.3) savingsScore = 30;
    else if (savingsRate >= 0.1) savingsScore = 20;
    else if (savingsRate > 0) savingsScore = 10;
    else savingsScore = 0;

    /* ===========================================================
       TREND SKORU 
    ============================================================ */
    const slope = calculateTrendSlope(values);
    let trendScore = 0;

    if (slope > 80) trendScore = 20;
    else if (slope > 20) trendScore = 15;
    else if (slope >= 0) trendScore = 10;
    else if (slope > -50) trendScore = 5;
    else trendScore = 2;

    /* ===========================================================
       İSTİKRAR SKORU
    ============================================================ */
    const stabilityScore = calculateStabilityScore(values);

    /* ===========================================================
       GÜVENİLİRLİK (Pozitif ay oranı)
    ============================================================ */
    const positiveMonths = values.filter(v => v > 0).length;
    const reliabilityRatio = positiveMonths / values.length;
    const reliabilityScore = Math.round(reliabilityRatio * 20);

    /* ===========================================================
       FİNAL SKOR
    ============================================================ */
    const finalScore = Math.min(
      100,
      savingsScore + stabilityScore + trendScore + reliabilityScore
    );

    /* ===========================================================
       ÖNERİLER
    ============================================================ */
    const recommendations = [];

    if (savingsRate >= 0.5)
      recommendations.push("Gelirinizin büyük kısmını tasarruf ediyorsunuz. Bu olumlu bir durum.");
    else if (savingsRate >= 0.1)
      recommendations.push("Tasarruf oranınız makul ancak artırılabilir.");
    else
      recommendations.push("Tasarruf oranınız düşük. Harcamalarınızı gözden geçirmeniz faydalı olur.");

    if (stabilityScore < 10)
      recommendations.push("Aylık bakiyenizde dalgalanmalar var. Daha düzenli bir bütçe takibi önerilir.");

    if (slope < -100)
      recommendations.push("Finansal trendiniz belirgin şekilde düşüşte. Acil önlem alınmalı.");
    else if (slope < 0)
      recommendations.push("Finansal trendiniz düşüşte. Gider optimizasyonları faydalı olur.");

    if (reliabilityRatio < 0.5)
      recommendations.push("Ayların çoğunda negatif bakiye görülmüş. Gelir–gider dengesini yeniden planlamalısınız.");

    if (finalScore >= 80)
      recommendations.push("Finansal sağlığınız iyi seviyede. Bu performansı koruyabilirsiniz.");
    else if (finalScore < 40)
      recommendations.push("Finansal durum kritik seviyede. Acil bütçe düzenlemesi önerilir.");

    /* ===========================================================
       KATEGORİ
    ============================================================ */
    let category = "Kritik";
    let categoryColor = "red";

    if (finalScore >= 80) {
      category = "Mükemmel";
      categoryColor = "green";
    } else if (finalScore >= 60) {
      category = "İyi";
      categoryColor = "blue";
    } else if (finalScore >= 40) {
      category = "Orta";
      categoryColor = "yellow";
    }

    res.json({
      finalScore,
      category,
      categoryColor,
      chartData,
      metrics: {
        savingsRate: (savingsRate * 100).toFixed(1),
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

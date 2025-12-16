import express from "express";
import MonthlyBalance from "../models/MonthlyBalance.js";
import Income from "../models/Income.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// --- HELPER FUNCTIONS ---
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

const calculateStdDev = (arr, meanVal) => {
  if (arr.length < 2) return 0;
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - meanVal, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
};

router.get("/analyze", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();

    const [balanceDoc, incomes] = await Promise.all([
      MonthlyBalance.findOne({ year: currentYear, user: userId }),
      Income.find({ year: currentYear, user: userId })
    ]);

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

    const totalYearlyIncome = incomes.reduce(
      (acc, curr) => acc + (curr.value || 0), 0
    );

    const uniqueIncomeMonths = new Set(incomes.map(item => item.month)).size;
    const incomeDivisor = uniqueIncomeMonths > 0 ? uniqueIncomeMonths : 1;
    const totalMonthlyIncome = totalYearlyIncome / incomeDivisor;

    const validBalances = values.filter(v => v !== 0);
    const avgNetBalance = validBalances.length
      ? validBalances.reduce((a, b) => a + b, 0) / validBalances.length
      : 0;

    const savingsRate = totalMonthlyIncome > 0
      ? avgNetBalance / totalMonthlyIncome
      : 0;

    const stdDev = calculateStdDev(values, avgNetBalance);
    const cv = avgNetBalance !== 0 ? Math.abs(stdDev / avgNetBalance) : 1;
    const slope = calculateTrendSlope(values);

    const positiveMonths = values.filter(v => v > 0).length;
    const reliabilityRatio = positiveMonths / values.length;

    // -----------------------------
    // SCORING
    // -----------------------------

    let savingsScore = 0;
    if (savingsRate >= 0.5) savingsScore = 40;
    else if (savingsRate >= 0.3) savingsScore = 30;
    else if (savingsRate >= 0.1) savingsScore = 20;
    else if (savingsRate > 0) savingsScore = 10;

    let stabilityScore = 0;
    if (cv < 0.2) stabilityScore = 20;
    else if (cv < 0.5) stabilityScore = 15;
    else if (cv < 1.0) stabilityScore = 5;

    let trendScore = 0;
    if (slope > 50) trendScore = 20;
    else if (slope > -50) trendScore = 15;
    else trendScore = 5;

    let reliabilityScore = Math.round(reliabilityRatio * 20);

    const finalScore = Math.min(
      100,
      savingsScore + stabilityScore + trendScore + reliabilityScore
    );

    // -----------------------------
    // RECOMMENDATIONS (INSIDE ROUTE)
    // -----------------------------

    const generateRecommendations = () => {
      const recs = [];

      // Savings
      if (savingsRate > 1) {
        recs.push(
          "Tasarruf oranınız %100'ün üzerinde görünüyor. Bu genellikle eksik veya hatalı gelir kayıtlarından kaynaklanır. Gelir verilerinizi kontrol etmeniz önerilir."
        );
      } else if (savingsRate >= 0.5) {
        recs.push(
          "Gelirinizin %50'sinden fazlasını tasarruf ediyorsunuz. Bu oldukça güçlü bir finansal disiplin göstergesidir. Uzun vadeli yatırım araçlarını değerlendirebilirsiniz."
        );
      } else if (savingsRate >= 0.3) {
        recs.push(
          "Tasarruf oranınız sağlıklı seviyede (%30–50). Harcama optimizasyonu ile bu oranı daha da artırabilirsiniz."
        );
      } else if (savingsRate >= 0.1) {
        recs.push(
          "Tasarruf oranınız %10–30 aralığında. Sabit giderlerinizi gözden geçirerek tasarruf potansiyelinizi artırabilirsiniz."
        );
      } else {
        recs.push(
          "Tasarruf oranınız oldukça düşük. Uzun vadeli finansal güvenlik için gider kontrolüne öncelik vermeniz önerilir."
        );
      }

      // Stability
      if (cv > 1) {
        recs.push(
          "Aylık bakiyenizde çok yüksek dalgalanmalar var. Bu, düzensiz gelir veya kontrolsüz harcamalara işaret eder."
        );
      } else if (cv > 0.5) {
        recs.push(
          "Aylık bakiyenizde belirgin dalgalanmalar tespit edildi. Bir acil durum fonu oluşturmanız faydalı olabilir."
        );
      } else if (cv < 0.2) {
        recs.push(
          "Aylık bakiyeniz oldukça istikrarlı. Bütçe yönetimini başarılı şekilde yapıyorsunuz."
        );
      }

      // Trend
      if (slope < -100) {
        recs.push(
          "Finansal trendiniz belirgin şekilde aşağı yönlü. Son aylarda giderleriniz gelirinizden daha hızlı artmış olabilir."
        );
      } else if (slope < 0) {
        recs.push(
          "Finansal trendiniz hafif düşüş eğiliminde. Küçük optimizasyonlarla bu trend pozitife çevrilebilir."
        );
      } else if (slope > 50) {
        recs.push(
          "Finansal trendiniz yükseliş yönünde. Doğru finansal kararlar alıyorsunuz."
        );
      }

      // Reliability
      if (reliabilityRatio < 0.5) {
        recs.push(
          "Ayların büyük bölümünde harcamalar gelirleri aşmış. Daha sürdürülebilir bir bütçe yapısı oluşturmanız önerilir."
        );
      } else if (reliabilityRatio > 0.8) {
        recs.push(
          "Ayların büyük çoğunluğunda pozitif bakiye elde etmişsiniz. Bu güçlü bir finansal güvenilirlik göstergesidir."
        );
      }

      // Overall
      if (finalScore >= 85) {
        recs.push(
          "Genel finansal sağlığınız çok güçlü. Bu performansı koruyarak uzun vadeli hedeflere odaklanabilirsiniz."
        );
      } else if (finalScore < 40) {
        recs.push(
          "Genel finansal durumunuz risk seviyesinde. Gelir–gider dengesini yeniden yapılandırmanız önemlidir."
        );
      }

      return recs;
    };

    const recommendations = generateRecommendations();

    // -----------------------------
    // CATEGORY
    // -----------------------------

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
import dotenvConfig from "../utils/dotenvConfig.js";
import connectDB from "../config/db.js";
import SurveyQuestion from "../models/surveyQuestion.js";

dotenvConfig();

const questions = [
  {
    question: "Yatırım yapmaktaki birincil amacınız nedir?",
    options: [
      { label: "Sermayemi korumak (Düşük Risk)", value: 1 },
      { label: "Enflasyona karşı korumak (Orta Risk)", value: 2 },
      { label: "Sermayemi büyütmek (Yüksek Risk)", value: 3 },
    ],
  },
  {
    question: "Yatırımlarınızı ne kadar süre elinizde tutmayı planlıyorsunuz?",
    options: [
      { label: "Kısa vadeli (1 yıldan az)", value: 1 },
      { label: "Orta vadeli (1-3 yıl)", value: 2 },
      { label: "Uzun vadeli (3 yıldan fazla)", value: 3 },
    ],
  },
  {
    question: "Piyasalarda ani bir %20 düşüş olsa tepkiniz ne olurdu?",
    options: [
      { label: "Hepsini satıp nakite geçerim", value: 1 },
      { label: "Beklerim, piyasa toparlanır", value: 2 },
      { label: "Fırsat bilip daha fazla alırım", value: 3 },
    ],
  },
  {
    question: "Yatırım deneyiminiz hangi seviyede?",
    options: [
      { label: "Hiç yok / Çok az", value: 1 },
      { label: "Temel bilgiye sahibim", value: 2 },
      { label: "Deneyimli yatırımcıyım", value: 3 },
    ],
  },
  {
    question: "Hangi yatırım aracı size daha yakın geliyor?",
    options: [
      { label: "Mevduat / Altın (Güvenli)", value: 1 },
      { label: "Yatırım Fonları / Dengeli Portföy", value: 2 },
      { label: "Hisse Senetleri / Kripto (Büyüme)", value: 3 },
    ],
  },
  {
    question: "Mevcut gelir kaynağınızın istikrarı nasıldır?",
    options: [
      { label: "Değişken / Belirsiz", value: 1 },
      { label: "Düzenli ama birikim zor", value: 2 },
      { label: "Düzenli ve yüksek tasarruf potansiyeli var", value: 3 },
    ],
  },
  {
    question: "Beklediğiniz yıllık getiri oranı nedir?",
    options: [
      { label: "%5 - %10 (Düşük risk)", value: 1 },
      { label: "%10 - %20 (Orta risk)", value: 2 },
      { label: "%20 ve üzeri (Yüksek risk)", value: 3 },
    ],
  }
];

const seedSurvey = async () => {
  try {
    await connectDB();

    // Clear existing questions
    await SurveyQuestion.deleteMany();
    console.log("🗑️  Old questions removed...");

    // Insert new ones
    await SurveyQuestion.insertMany(questions);
    console.log("✅ Survey questions seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding survey:", error);
    process.exit(1);
  }
};

seedSurvey();
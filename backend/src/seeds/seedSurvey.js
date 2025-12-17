import dotenvConfig from "../utils/dotenvConfig.js";
import connectDB from "../config/db.js";
import SurveyQuestion from "../models/surveyQuestion.js";

dotenvConfig();

/* Mantık:
   Value 1: Muhafazakar (Düşük Risk / Koruma Odaklı)
   Value 2: Dengeli (Orta Risk / Büyüme ve Koruma)
   Value 3: Agresif (Yüksek Risk / Maksimum Getiri)
*/

const questions = [
  {
    question: "Yatırım yaparken sizin için en önemli öncelik hangisidir?",
    options: [
      { label: "Ana paramın değerini kesinlikle korumak ve kayıptan kaçınmak.", value: 1 },
      { label: "Enflasyonun üzerinde makul bir getiri ile sermayemi büyütmek.", value: 2 },
      { label: "Kısa vadeli dalgalanmaları göze alarak maksimum getiriye ulaşmak.", value: 3 },
    ],
  },
  {
    question: "Bu yatırımdan elde edeceğiniz nakde ne zaman ihtiyaç duyacaksınız?",
    options: [
      { label: "Çok yakında (0-1 yıl), her an bozdurabilirim.", value: 1 },
      { label: "Orta vadede (1-3 yıl), örneğin ev/araba peşinatı için.", value: 2 },
      { label: "Uzun vadede (3+ yıl), emeklilik veya gelecek planları için.", value: 3 },
    ],
  },
  {
    question: "Aşağıdaki yatırım senaryolarından hangisi sizi daha rahat hissettirir?",
    options: [
      { label: "Düşük getiri olsun ama ana paramın azaldığını hiç görmeyeyim.", value: 1 },
      { label: "Zaman zaman küçük düşüşler olabilir ama uzun vadede büyüsün.", value: 2 },
      { label: "Büyük düşüşleri tolere edebilirim, yeter ki sonunda yüksek kazanç ihtimali olsun.", value: 3 },
    ],
  },
  {
    question: "Piyasalarda ani bir düşüş olsa ve portföyünüz %20 değer kaybetse tepkiniz ne olur?",
    options: [
      { label: "Çok endişelenirim ve daha fazla kaybetmemek için kalanını satarım.", value: 1 },
      { label: "Endişelenirim ama panik yapmam, piyasanın toparlanmasını beklerim.", value: 2 },
      { label: "Bunu bir alım fırsatı olarak görür, maliyet düşürmek için ekleme yaparım.", value: 3 },
    ],
  },
  {
    question: "Finansal piyasalar ve yatırım araçları hakkındaki bilgi seviyenizi nasıl tanımlarsınız?",
    options: [
      { label: "Başlangıç seviyesindeyim, finansal terimler bana yabancı.", value: 1 },
      { label: "Piyasa takibi yapıyorum, temel kavramlara ve risklere hakimim.", value: 2 },
      { label: "Deneyimli bir yatırımcıyım, piyasa dinamiklerini aktif kullanırım.", value: 3 },
    ],
  },
  {
    question: "Yatırım için ayırdığınız paranın tamamını kaybetseniz, bu günlük yaşamınızı nasıl etkiler?",
    options: [
      { label: "Çok kötü etkiler, yaşam standartımı sürdüremem.", value: 1 },
      { label: "Üzülürüm ve planlarımı bir süre ertelemem gerekir ama hayatım devam eder.", value: 2 },
      { label: "Günlük yaşantımı etkilemez, bu riski göze alarak ayırdığım bir tutar.", value: 3 },
    ],
  },
  {
    question: "Yıllık getiri beklentiniz, enflasyona kıyasla nasıldır?",
    options: [
      { label: "Enflasyon kadar olsun, paramın alım gücü erimesin yeter.", value: 1 },
      { label: "Enflasyonun birkaç puan üzerinde reel bir getiri hedefliyorum.", value: 2 },
      { label: "Enflasyonun çok üzerinde, piyasa ortalamasını yenen yüksek bir getiri istiyorum.", value: 3 },
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
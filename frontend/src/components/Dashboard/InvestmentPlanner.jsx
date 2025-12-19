import "../../styles/Dashboard/InvestmentPlanner.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  User,
  BarChart2,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Globe,
  Building2,
  Bitcoin,
  Banknote,
  Gem,
  Activity
} from "lucide-react";

const apiUrl = process.env.REACT_APP_API_URL;

export default function InvestmentPlanner() {
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSurveyStarted, setIsSurveyStarted] = useState(false);
  const [isSurveyFinished, setIsSurveyFinished] = useState(false);
  const [answers, setAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState("all");
  console.log(selectedAssetType);

  const assetTypes = [
    {
      value: "all",
      label: "Tüm Piyasalar",
      icon: <Globe size={22} />
    },
    {
      value: "stock",
      label: "Hisse Senetleri",
      icon: <Building2 size={22} />
    },
    {
      value: "crypto",
      label: "Kripto Paralar",
      icon: <Bitcoin size={22} />
    },
    {
      value: "forex",
      label: "Döviz Çiftleri",
      icon: <Banknote size={22} />
    },
    {
      value: "commodity",
      label: "Emtialar",
      icon: <Gem size={22} />
    },
    {
      value: "index",
      label: "Borsa Endeksleri",
      icon: <Activity size={22} />
    }
  ];

  useEffect(() => {
    const fetchSurveyQuestions = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboard/get_survey_questions`);
        setSurveyQuestions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSurveyQuestions();
  }, []);

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);

    setResultData({ totalScore });
    setIsSurveyStarted(false);
    setIsSurveyFinished(true);
    setIsLoadingRecommendations(true);

    try {
      const res = await axios.get(
        `${apiUrl}/dashboard/get_market_recommendations?score=${totalScore}&type=${selectedAssetType}`
      );
      setRecommendationData(res.data);
    } catch (error) {
      console.log("Error fetching recommendations", error);
    }

    setIsLoadingRecommendations(false);
  };

  const getCurrencySymbolOverride = code => {
    switch (code) {
      case "TRY":
        return "₺";
      case "CHF":
        return "Fr.";
      default:
        return null;
    }
  };

  const formatCurrency = (val, symbol) => {
    let currencyCode = "USD";

    if (!symbol) return `$${val.toFixed(2)}`;

    if (symbol.includes("TRY") || symbol.endsWith(".IS")) {
      currencyCode = "TRY";
    } else if (symbol.endsWith("=X")) {
      const clean = symbol.replace("=X", "");
      if (clean.length === 6) currencyCode = clean.slice(3);
    } else if (symbol.includes("-")) {
      const parts = symbol.split("-");
      if (parts.length === 2) currencyCode = parts[1];
    }

    const override = getCurrencySymbolOverride(currencyCode);
    if (override) return `${override} ${val.toFixed(2)}`;

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(val);
    } catch {
      return `$${val.toFixed(2)}`;
    }
  };

  const getIcon = () => <BarChart2 size={24} className="asset-icon-svg" />;

  const getVolBadgeClass = vol => {
    if (vol < 20) return "badge-green";
    if (vol < 40) return "badge-yellow";
    return "badge-red";
  };

  return (
    <div className="investment-planner-container">
      <div className="planner-header">
        <h2 className="planner-title">Yatırım Planlama</h2>
        {!isSurveyStarted && !isSurveyFinished && (
          <span className="planner-subtitle">Portföy önerisi sunma aracı</span>
        )}
      </div>

      {/* ------------------------ ASSET TYPE SELECTION ------------------------ */}
      {!isSurveyStarted && !isSurveyFinished && (
        <div className="intro-card">
          <div className="intro-content">
            <h3 style={{ marginBottom: "1rem" }}>İlgilendiğiniz Yatırım Aracı</h3>

            <div className="asset-type-grid">
              {assetTypes.map(item => (
                <div
                  key={item.value}
                  onClick={() => setSelectedAssetType(item.value)}
                  className={`asset-type-card ${selectedAssetType === item.value ? "asset-type-selected" : ""
                    }`}
                >
                  <div className="asset-icon">{item.icon}</div>
                  <span className="asset-type-label">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="intro-icon-wrapper">
              <User size={32} />
            </div>

            <h3>Yatırım Profilinizi Keşfedin</h3>
            <p>
              Risk toleransı anketi ile finansal hedeflerinizi analiz ediyor,
              size en uygun yatırım araçlarını öneriyoruz.
            </p>

            <button className="start-button" onClick={() => setIsSurveyStarted(true)}>
              Analize Başla <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      {isSurveyStarted && !isSurveyFinished && surveyQuestions.length > 0 && (
        <div className="survey-wizard">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentStep + 1) / surveyQuestions.length) * 100}%` }}
            ></div>
          </div>
          <div className="question-card">
            <span className="question-counter">
              Soru {currentStep + 1} / {surveyQuestions.length}
            </span>
            <h3 className="question-text">{surveyQuestions[currentStep].question}</h3>

            <div className="options-grid">
              {surveyQuestions[currentStep].options.map((option, idx) => (
                <label
                  key={idx}
                  className={`option-card ${answers[currentStep] === option.value ? "selected" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentStep}`}
                    value={option.value}
                    checked={answers[currentStep] === option.value}
                    onChange={() => handleAnswerSelect(currentStep, option.value)}
                  />
                  <div className="option-content">
                    <span className="option-label">{option.label}</span>
                    {answers[currentStep] === option.value && (
                      <CheckCircle size={18} className="check-icon" />
                    )}
                  </div>
                </label>
              ))}
            </div>
            <div className="wizard-actions">
              <button
                className="back-button"
                disabled={currentStep === 0}
                onClick={handleBack}
              >
                <ArrowLeft size={16} /> Geri
              </button>
              <button
                className="next-button"
                disabled={!answers[currentStep]}
                onClick={handleNext}
              >
                {currentStep === surveyQuestions.length - 1
                  ? "Sonuçları Gör"
                  : "Sonraki Soru"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {isSurveyFinished && (
        <div className="results-view">
          <div className="score-summary-card">
            <div className="score-info">
              <span className="score-title">RİSK SKORUNUZ</span>
              <div className="score-display">
                <span className="score-number">{resultData?.totalScore}</span>
                <span className="score-total">/ 21</span>
              </div>
            </div>
            <div className="profile-info">
              <span className="profile-title">YATIRIMCI PROFİLİ</span>
              <h2 className="profile-name">
                {isLoadingRecommendations ? "Hesaplanıyor..." : recommendationData?.riskCategory}
              </h2>
            </div>
          </div>
          {!isLoadingRecommendations && recommendationData?.comment && (
            <div className="insight-card">
              <div className="insight-icon">
                <Lightbulb size={24} />
              </div>
              <div className="insight-content">
                <h4>Algoritma Analizi</h4>
                <p>{recommendationData.comment}</p>
              </div>
            </div>
          )}
          <h3 className="section-title">Sizin İçin Seçilen Hisseler</h3>

          {isLoadingRecommendations ? (
            <div className="loading-state">
              <div className="spinner-ip"></div>
              <p>Piyasa verileri analiz ediliyor...</p>
            </div>
          ) : (
            <div className="recommendations-grid">
              {recommendationData?.recommendations.map((asset, idx) => (
                <div key={idx} className="stock-card">
                  <div className="stock-header">
                    <div className="stock-identity">
                      <div className="stock-icon">{getIcon()}</div>
                      <div>
                        <h4 className="stock-symbol">{asset.symbol}</h4>
                        <span className="stock-name" style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          {asset.name}
                        </span>
                      </div>
                    </div>
                    <div className="stock-price">
                      {formatCurrency(asset.currentPrice, asset.symbol)}
                    </div>
                  </div>
                  <div className="stock-metrics">
                    <div className="metric-item">
                      <span className="metric-label">90 Günlük Değişim</span>
                      <span className={`metric-value ${asset.change >= 0 ? "trend-up" : "trend-down"}`}>
                        {asset.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(asset.change)}%
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Volatilite (Risk)</span>
                      <span className={`metric-badge ${getVolBadgeClass(asset.volatility)}`}>
                        %{asset.volatility}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isLoadingRecommendations && (
            <button
              className="reset-button"
              onClick={() => {
                setIsSurveyFinished(false);
                setIsSurveyStarted(false);
                setAnswers({});
                setCurrentStep(0);
                setRecommendationData(null);
              }}
            >
              <RefreshCw size={16} /> Analizi Tekrarla
            </button>
          )}
        </div>
      )}
    </div>
  );
}

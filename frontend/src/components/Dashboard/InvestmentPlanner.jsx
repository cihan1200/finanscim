import "../../styles/Dashboard/InvestmentPlanner.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart2,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  ArrowRight
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

  const calculateResults = async () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    setResultData({ totalScore });
    setIsSurveyStarted(false);
    setIsSurveyFinished(true);
    setIsLoadingRecommendations(true);
    try {
      const res = await axios.get(
        `${apiUrl}/dashboard/get_market_recommendations?score=${totalScore}`
      );
      setRecommendationData(res.data);
    } catch (error) {
      console.log("Error fetching recommendations", error);
    }
    setIsLoadingRecommendations(false);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const getIcon = () => {
    return <BarChart2 size={24} className="asset-icon-svg" />;
  };

  const getVolBadgeClass = (vol) => {
    if (vol < 20) return "badge-green";
    if (vol < 40) return "badge-yellow";
    return "badge-red";
  };

  return (
    <div className="investment-planner-container">
      <div className="planner-header">
        <h2 className="planner-title">Yatırım Planlama</h2>
        {!isSurveyStarted && !isSurveyFinished && (
          <span className="planner-subtitle">Yapay Zeka Destekli Portföy Önerisi</span>
        )}
      </div>
      {!isSurveyStarted && !isSurveyFinished && (
        <div className="intro-card">
          <div className="intro-content">
            <div className="intro-icon-wrapper">
              <Zap size={32} />
            </div>
            <h3>Yatırım Profilinizi Keşfedin</h3>
            <p>
              Risk toleransı anketi ile finansal hedeflerinizi analiz ediyor,
              AHP (Analitik Hiyerarşi Prosesi) algoritması kullanarak size en uygun
              S&P 500 hisselerini öneriyoruz.
            </p>
            <button
              className="start-button"
              onClick={() => setIsSurveyStarted(true)}
            >
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
            <span className="question-counter">Soru {currentStep + 1} / {surveyQuestions.length}</span>
            <h3 className="question-text">{surveyQuestions[currentStep].question}</h3>
            <div className="options-grid">
              {surveyQuestions[currentStep].options.map((option, idx) => (
                <label
                  key={idx}
                  className={`option-card ${answers[currentStep] === option.value ? 'selected' : ''}`}
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
                    {answers[currentStep] === option.value && <CheckCircle size={18} className="check-icon" />}
                  </div>
                </label>
              ))}
            </div>
            <div className="wizard-actions">
              <button
                className="next-button"
                disabled={!answers[currentStep]}
                onClick={handleNext}
              >
                {currentStep === surveyQuestions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru'}
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
                        <span className="stock-name">S&P 500 Stock</span>
                      </div>
                    </div>
                    <div className="stock-price">
                      {formatCurrency(asset.currentPrice)}
                    </div>
                  </div>
                  <div className="stock-metrics">
                    <div className="metric-item">
                      <span className="metric-label">90 Günlük Değişim</span>
                      <span className={`metric-value ${asset.change >= 0 ? 'trend-up' : 'trend-down'}`}>
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
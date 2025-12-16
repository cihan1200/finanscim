import "../../styles/Dashboard/FinancialHealth.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { TrendingUp, Activity, PieChart, AlertCircle, CheckCircle } from "lucide-react";
import CustomTooltip from "./CustomTooltip";
import { useDashboard } from "../../context/DashboardContext";

const apiUrl = process.env.REACT_APP_API_URL;

export default function FinancialHealth() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useDashboard();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token) return;
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const res = await axios.get(
          `${apiUrl}/financial-health/analyze?t=${new Date().getTime()}`,
          config
        );
        setAnalysis(res.data);
      } catch (error) {
        console.error("Error loading financial health data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [refreshTrigger, token]);

  if (loading) {
    return (
      <div className="financial-health-container">
        <div className="loading-state">
          <div className="spinner-fh"></div>
          <p>Finansal veriler analiz ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!analysis || analysis.status === "insufficient_data") {
    return (
      <div className="financial-health-container">
        <div className="health-header">
          <h2 className="health-title">Finansal Sağlık Analizi</h2>
        </div>
        <div className="recommendations-card">
          <div className="rec-header">
            <AlertCircle size={20} className="rec-icon" />
            <h3>Veri Bekleniyor</h3>
          </div>
          <p style={{ padding: "1rem", color: "#718096" }}>
            Analiz yapabilmek için lütfen önce Gelir/Gider ve Bütçe verilerinizi giriniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-health-container">
      <div className="health-header">
        <h2 className="health-title">Finansal Sağlık Analizi</h2>
        <span className={`health-badge badge-${analysis.categoryColor}`}>
          {analysis.category} Durum
        </span>
      </div>
      <div className="health-grid">
        <div className="health-chart-card">
          <div className="card-header">
            <h3>Bakiye Trendi</h3>
            <span className="subtitle">Son 12 Aylık Net Bakiye Değişimi</span>
          </div>
          <div className="chart-wrapper-health">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analysis.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#718096' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#718096' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#cbd5e0', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <ReferenceLine y={0} stroke="#cbd5e0" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#635bff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#635bff', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="health-score-card">
          <div className="total-score-display">
            <div className="score-circle">
              <span className="score-number">{analysis.finalScore}</span>
              <span className="score-label">/100</span>
            </div>
            <div className="score-context">
              <h4>Genel Skor</h4>
              <p>Bankacılık standartlarına göre hesaplanmıştır.</p>
            </div>
          </div>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-name"><PieChart size={14} /> Tasarruf Oranı</span>
                <span className="metric-val">%{analysis.metrics.savingsRate}</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: `${(analysis.metrics.savingsScore / 40) * 100}%` }}
                ></div>
              </div>
              <p className="metric-desc">
                Aylık gelirinizin ne kadarını birikime ayırabildiğinizi gösterir.
              </p>
            </div>
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-name"><Activity size={14} /> İstikrar</span>
                <span className="metric-val">{analysis.metrics.stabilityScore}/20</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: `${(analysis.metrics.stabilityScore / 20) * 100}%` }}
                ></div>
              </div>
              <p className="metric-desc">
                Harcama düzeninizin aylar arasındaki dengesini ve tutarlılığını ölçer.
              </p>
            </div>
            <div className="metric-item">
              <div className="metric-info">
                <span className="metric-name"><TrendingUp size={14} /> Büyüme Trendi</span>
                <span className="metric-val">{analysis.metrics.trendScore}/20</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: `${(analysis.metrics.trendScore / 20) * 100}%` }}
                ></div>
              </div>
              <p className="metric-desc">
                Finansal varlıklarınızın zaman içindeki artış veya azalış eğilimini analiz eder.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="recommendations-card">
        <div className="rec-header">
          <AlertCircle size={20} className="rec-icon" />
          <h3>İyileştirme Önerileri</h3>
        </div>
        <ul className="rec-list">
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            analysis.recommendations.map((rec, idx) => (
              <li key={idx}>
                <CheckCircle size={16} className="check-icon" /> {rec}
              </li>
            ))
          ) : (
            <li>Şu an için kritik bir öneri bulunmamaktadır.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
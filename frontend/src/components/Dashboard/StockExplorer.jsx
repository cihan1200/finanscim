import "../../styles/Dashboard/StockExplorer.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Search, TrendingUp, TrendingDown,
  ArrowLeft, Activity, Calendar
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const apiUrl = process.env.REACT_APP_API_URL;

export default function StockExplorer() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartHistory, setChartHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("1mo");
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboard/get_market_list`);
        setStocks(res.data);
        setFilteredStocks(res.data);
      } catch (error) {
        console.error("Failed to load stocks");
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    const results = stocks.filter(s =>
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(results);
  }, [searchTerm, stocks]);

  useEffect(() => {
    if (!selectedStock) return;
    const fetchHistory = async () => {
      setLoadingDetail(true);
      try {
        const res = await axios.get("http://localhost:5000/dashboard/get_stock_detail", {
          params: { symbol: selectedStock.symbol, range: timeRange }
        });
        setChartHistory(res.data);
      } catch (error) {
        console.error("Failed to load chart");
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchHistory();
  }, [selectedStock, timeRange]);


  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const ranges = [
    { label: "1 Gün", value: "1d" },
    { label: "1 Ay", value: "1mo" },
    { label: "3 Ay", value: "3mo" },
    { label: "1 Yıl", value: "1y" },
  ];

  if (selectedStock) {
    return (
      <div className="stock-explorer-container detail-mode">
        <div className="detail-header">
          <button className="back-button" onClick={() => setSelectedStock(null)}>
            <ArrowLeft size={20} /> Geri Dön
          </button>
          <div className="detail-title-group">
            <div className="stock-badge-large">{selectedStock.symbol}</div>
          </div>
        </div>
        <div className="detail-grid">
          <div className="detail-chart-card">
            <div className="chart-header-row">
              <div>
                <span className="current-price-label">Anlık Fiyat</span>
                <h2 className="current-price-large">{formatCurrency(selectedStock.currentPrice)}</h2>
              </div>
              <div className="range-tabs">
                {ranges.map(r => (
                  <button
                    key={r.value}
                    className={`range-tab ${timeRange === r.value ? 'active' : ''}`}
                    onClick={() => setTimeRange(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-area">
              {loadingDetail ? (
                <div className="loading-chart"><div className="spinner-se"></div></div>
              ) : (
                <ResponsiveContainer width="100%" height={300} key={selectedStock.symbol}>
                  <AreaChart data={chartHistory}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#635bff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#718096' }}
                      tickLine={false} axisLine={false}
                      minTickGap={30}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 11, fill: '#718096' }}
                      tickLine={false} axisLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`$${value}`, "Fiyat"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#635bff"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="detail-stats-card">
            <h3>İstatistikler</h3>
            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-label"><Activity size={14} /> Günlük Değişim</span>
                <span className={`stat-value ${selectedStock.dailyChange >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {selectedStock.dailyChange}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Calendar size={14} /> 90 Günlük</span>
                <span className={`stat-value ${selectedStock.change >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {selectedStock.change}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><TrendingUp size={14} /> 90G En Yüksek</span>
                <span className="stat-value">${selectedStock.high?.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><TrendingDown size={14} /> 90G En Düşük</span>
                <span className="stat-value">${selectedStock.low?.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Activity size={14} /> Volatilite</span>
                <span className="stat-value">%{selectedStock.volatility}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="stock-explorer-container">
      <div className="explorer-header">
        <h2 className="explorer-title">Piyasa Genel Bakış</h2>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Hisse ara (örn: AAPL)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="loading-state">
          <div className="spinner-se"></div>
          <p>Piyasa verileri yükleniyor...</p>
        </div>
      ) : (
        <div className="stocks-grid">
          {filteredStocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="stock-list-card"
              onClick={() => setSelectedStock(stock)}
            >
              <div className="card-top">
                <div className="stock-badge">{stock.symbol}</div>
                <div className={`trend-badge ${stock.dailyChange >= 0 ? 'bg-green' : 'bg-red'}`}>
                  {stock.dailyChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(stock.dailyChange)}%
                </div>
              </div>
              <div className="card-mid">
                <span className="stock-price-list">{formatCurrency(stock.currentPrice)}</span>
                <span className="price-label">Güncel Fiyat</span>
              </div>
              <div className="card-btm">
                <span className="stock-vol">Volatilite: %{stock.volatility}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
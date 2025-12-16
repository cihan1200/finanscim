import "../../styles/Dashboard/BudgetOverview.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { BanknoteArrowUp, BanknoteArrowDown, Save, Calendar } from 'lucide-react';
import { useDashboard } from "../../context/DashboardContext";
import GridSaveSuccess from "../Popups/GridSaveSuccess";

const formatCurrency = (amount) => {
  const value = amount === "" ? 0 : amount;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getMonthName = (index) => {
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  return monthNames[index];
};

const apiUrl = process.env.REACT_APP_API_URL;

export default function BudgetOverview({ currentIncome, currentExpense, onDataSaved }) {
  const { triggerRefresh } = useDashboard();
  const [yearlyBalances, setYearlyBalances] = useState(new Array(12).fill(0));
  const [initialYearlyBalances, setInitialYearlyBalances] = useState(new Array(12).fill(0));
  const [isSavingGrid, setIsSavingGrid] = useState(false);
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [showGridSuccess, setShowGridSuccess] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const currentNetBalance = currentIncome - currentExpense;
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonthName = getMonthName(currentMonthIndex);
  const currentYear = currentDate.getFullYear();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    async function fetchYearlyData() {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${apiUrl}/api/monthly-balances/${currentYear}`, config);
        if (response.data && response.data.balances) {
          setYearlyBalances(response.data.balances);
          setInitialYearlyBalances(response.data.balances);
        }
      } catch (error) {
        console.error("Error fetching yearly balances:", error);
      } finally {
        setLoadingGrid(false);
      }
    }
    if (token) fetchYearlyData();
  }, [currentYear, token]);

  useEffect(() => {
    if (!loadingGrid) {
      setYearlyBalances(prevBalances => {
        const newBalances = [...prevBalances];
        if (newBalances[currentMonthIndex] === currentNetBalance) {
          return prevBalances;
        }
        newBalances[currentMonthIndex] = currentNetBalance;
        return newBalances;
      });
    }
  }, [currentNetBalance, currentMonthIndex, loadingGrid]);

  const hasGridChanged = useMemo(() => {
    if (loadingGrid) return false;
    return JSON.stringify(yearlyBalances) !== JSON.stringify(initialYearlyBalances);
  }, [yearlyBalances, initialYearlyBalances, loadingGrid]);

  const handleGridChange = (index, value) => {
    if (index === currentMonthIndex) return;
    const newBalances = [...yearlyBalances];
    newBalances[index] = value === "" ? "" : Number(value);
    setYearlyBalances(newBalances);
  };

  const handleGridSave = async () => {
    setIsSavingGrid(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sanitizedBalances = yearlyBalances.map(v => v === "" ? 0 : Number(v));
      await axios.put(`${apiUrl}/api/monthly-balances/${currentYear}`, {
        balances: sanitizedBalances
      }, config);
      setInitialYearlyBalances(sanitizedBalances);
      setShowGridSuccess(true);
      setTimeout(() => setShowGridSuccess(false), 3000);
      if (onDataSaved) {
        onDataSaved();
      }
      triggerRefresh();
    } catch (error) {
      console.error("Grid save error:", error);
      alert("Hata oluştu.");
    } finally {
      setIsSavingGrid(false);
    }
  };

  return (
    <div className="budget-overview-container">
      {showGridSuccess && <GridSaveSuccess />}
      <div className="overview-header">
        <h2 className="overview-title">Bütçe Özeti</h2>
        <span className="current-month-label">{currentMonthName} Ayı</span>
      </div>
      <div className="summary-row">
        <div className="summary-block income-block">
          <div className="summary-icon icon-income"><BanknoteArrowUp size="1em" /></div>
          <div className="summary-content">
            <span className="summary-label">TOPLAM GELİR</span>
            <span className="summary-value income-text">{formatCurrency(currentIncome)}</span>
          </div>
        </div>
        <div className="summary-block expense-block">
          <div className="summary-icon icon-expense"><BanknoteArrowDown size="1em" /></div>
          <div className="summary-content">
            <span className="summary-label">TOPLAM GİDER</span>
            <span className="summary-value expense-text">{formatCurrency(currentExpense)}</span>
          </div>
        </div>
        <div className={`summary-block balance-block ${currentNetBalance >= 0 ? 'positive-bg' : 'negative-bg'}`}>
          <div className="summary-content balance-content">
            <span className="summary-label">NET BAKİYE</span>
            <span className={`summary-value ${currentNetBalance >= 0 ? 'income-text' : 'expense-text'}`}>
              {formatCurrency(currentNetBalance)}
            </span>
          </div>
        </div>
      </div>
      <hr className="overview-divider" />
      <div className="yearly-grid-section">
        <div className="overview-header">
          <h2 className="overview-title">
            <Calendar size="1.2em" style={{ marginRight: '10px', color: '#4f46e5' }} />
            {currentYear} Yıllık Bakiye Tablosu
          </h2>
          <button
            className="grid-save-button"
            onClick={handleGridSave}
            disabled={!hasGridChanged || isSavingGrid || loadingGrid}
          >
            {isSavingGrid ? (
              <>
                <div className="spinner"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size="1.1em" />
                Tabloyu Kaydet
              </>
            )}
          </button>
        </div>
        {loadingGrid ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Veriler yükleniyor...</div>
        ) : (
          <div className="months-grid">
            {yearlyBalances.map((balance, index) => {
              const isCurrent = index === currentMonthIndex;
              const isEditing = focusedIndex === index;
              const displayValue = (isCurrent || !isEditing)
                ? formatCurrency(balance)
                : balance;
              return (
                <div key={index} className={`month-card ${isCurrent ? 'current' : ''}`}>
                  <div className="month-label-row">
                    <span>{getMonthName(index)}</span>
                    {isCurrent && <span className="current-badge">ŞU AN</span>}
                  </div>
                  <input
                    type={(isEditing && !isCurrent) ? "number" : "text"}
                    className={`month-input ${isCurrent ? 'read-only' : ''}`}
                    value={displayValue}
                    onChange={(e) => handleGridChange(index, e.target.value)}
                    onFocus={() => !isCurrent && setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    disabled={isCurrent}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
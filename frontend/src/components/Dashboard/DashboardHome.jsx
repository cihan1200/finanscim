import "../../styles/Dashboard/Home.css";
import { useState, useCallback } from "react";
import BudgetChart from "./BudgetChart";
import IncomeTracker from "./IncomeTracker";
import ExpenseTracker from "./ExpenseTracker";
import BudgetOverview from "./BudgetOverview";

export default function DashboardHome() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartRefreshTrigger, setChartRefreshTrigger] = useState(0);
  const handleIncomeChange = useCallback((value) => {
    setTotalIncome(value);
  }, []);

  const handleExpenseChange = useCallback((value) => {
    setTotalExpenses(value);
  }, []);

  const handleChartRefresh = useCallback(() => {
    setChartRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <>
      <h1 className="home-title">Ana sayfa</h1>
      <IncomeTracker onTotalChange={handleIncomeChange} />
      <ExpenseTracker onTotalChange={handleExpenseChange} />
      <BudgetOverview
        currentIncome={totalIncome}
        currentExpense={totalExpenses}
        onDataSaved={handleChartRefresh}
      />
      <BudgetChart refreshTrigger={chartRefreshTrigger} />
    </>
  );
}
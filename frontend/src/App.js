import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import DashboardHome from './components/Dashboard/DashboardHome';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InvestmentPlanner from './components/Dashboard/InvestmentPlanner';
import FinancialHealth from './components/Dashboard/FinancialHealth';
import StockExplorer from './components/Dashboard/StockExplorer';
import ProtectedRoute from './components/Layouts/ProtectedRoute';
import { DashboardProvider } from './context/DashboardContext';
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            <DashboardProvider>
              <Dashboard />
            </DashboardProvider>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="investment_planner" element={<InvestmentPlanner />} />
            <Route path="radar" element={<FinancialHealth />} />
            <Route path="stock_explorer" element={<StockExplorer />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
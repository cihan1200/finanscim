import "../../styles/Dashboard/BudgetChart.css";
import CustomTooltip from "./CustomTooltip";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthNames = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const apiUrl = process.env.REACT_APP_API_URL;

export default function BudgetChart({ refreshTrigger }) {
  const [chartData, setChartData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    async function fetchData() {
      try {
        const currentYear = new Date().getFullYear();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `${apiUrl}/api/monthly-balances/${currentYear}?t=${Date.now()}`,
          config
        );
        if (response.data && response.data.balances) {
          const formattedData = response.data.balances.map((balance, index) => ({
            month: monthNames[index],
            netBalance: balance
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Chart fetch error:", error);
      }
    }
    if (token) {
      fetchData();
    }
  }, [refreshTrigger, token]);

  return (
    <div className="chart-wrapper">
      <h2>{new Date().getFullYear()} Yıllık Bütçe Özeti</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} position={{ x: '95%', y: 10 }} />
          <Line
            type="monotone"
            dataKey="netBalance"
            stroke="#635bff"
            strokeWidth={3}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
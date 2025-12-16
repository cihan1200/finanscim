import express from "express";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import incomeRoutes from "../routes/incomeRoutes.js";
import expenseRoutes from "../routes/expenseRoutes.js";
import monthlyBalanceRoutes from "../routes/monthlyBalanceRoutes.js";
import investmentPlannerRoutes from "../routes/investmentPlannerRoutes.js";
import dotenvConfig from "../utils/dotenvConfig.js";
import financialHealthRoutes from "../routes/financialHealthRoutes.js";

dotenvConfig();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: "*" // Temporarily allow all for deployment testing
  // origin: ["http://localhost:5173", "https://your-frontend-app.onrender.com"] // Switch to this later
}));
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/income", incomeRoutes);
app.use("/expense", expenseRoutes);
app.use("/api/monthly-balances", monthlyBalanceRoutes);
app.use("/dashboard", investmentPlannerRoutes);
app.use("/financial-health", financialHealthRoutes);

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

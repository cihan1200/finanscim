import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import incomeRoutes from "./src/routes/incomeRoutes.js";
import expenseRoutes from "./src/routes/expenseRoutes.js";
import monthlyBalanceRoutes from "./src/routes/monthlyBalanceRoutes.js";
import investmentPlannerRoutes from "./src/routes/investmentPlannerRoutes.js";
import dotenvConfig from "./src/utils/dotenvConfig.js";
import financialHealthRoutes from "./src/routes/financialHealthRoutes.js";

dotenvConfig();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: "*"
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

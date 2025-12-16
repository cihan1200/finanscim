import mongoose from "mongoose";

const budgetChartDataSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true
    },
    netBalance: {
      type: Number,
      required: true
    },
  }
);

export default mongoose.model("BudgetChartData", budgetChartDataSchema);
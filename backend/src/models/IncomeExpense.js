import mongoose from "mongoose";

const incomeExpenseSchema = new mongoose.Schema({
  salary: { type: Number, default: 0 },
  additionalIncomes: [
    {
      id: String,
      name: String,
      value: Number
    }
  ],
  mainExpense: { type: Number, default: 0 },
  additionalExpenses: [
    {
      id: String,
      name: String,
      value: Number
    }
  ]
});

export default mongoose.model("IncomeExpense", incomeExpenseSchema);

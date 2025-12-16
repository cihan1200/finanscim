import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    month: {
      type: Number,
      required: true,
      index: true
    },
    year: {
      type: Number,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, month: 1, year: 1 });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;

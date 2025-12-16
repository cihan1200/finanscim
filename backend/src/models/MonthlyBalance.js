import mongoose from "mongoose";

const monthlyBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    year: {
      type: Number,
      required: true
    },
    balances: {
      type: [Number],
      default: new Array(12).fill(0),
      validate: [arrayLimit, '{PATH} exceeds the limit of 12 months']
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length === 12;
}

monthlyBalanceSchema.index({ user: 1, year: 1 }, { unique: true });

const MonthlyBalance = mongoose.model("MonthlyBalance", monthlyBalanceSchema);
export default MonthlyBalance;
import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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

incomeSchema.index({ user: 1, month: 1, year: 1 });

const Income = mongoose.model("Income", incomeSchema);
export default Income;

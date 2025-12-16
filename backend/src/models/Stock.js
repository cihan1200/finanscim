import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
  rank: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true
  }
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
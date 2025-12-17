import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  rank: { type: Number, required: true },

  name: { type: String, required: true },

  symbol: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  type: {
    type: String,
    enum: ["stock", "forex", "commodity", "crypto", "index"],
    required: true
  }
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;

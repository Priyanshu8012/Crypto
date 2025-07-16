const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  coinId: String,
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model("History", historySchema);

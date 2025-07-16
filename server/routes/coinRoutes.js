const express = require('express');
const axios = require('axios');
const Coin = require('../models/Coin');
const History = require('../models/History');
const router = express.Router();

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

// 🟢 GET /api/coins — Fetch + Save top 10 coins
router.get('/coins', async (req, res) => {
  try {
    const { data } = await axios.get(API_URL);

    const cleaned = data.map(c => ({
      coinId: c.id,
      name: c.name,
      symbol: c.symbol,
      price: c.current_price,
      marketCap: c.market_cap,
      change24h: c.price_change_percentage_24h,
      lastUpdated: new Date(c.last_updated),
    }));

    await Coin.deleteMany();
    await Coin.insertMany(cleaned);
    console.log("✅ Coins saved to MongoDB");

    res.json(cleaned);
  } catch (err) {
    console.error("❌ Error fetching coins:", err.message);
    res.status(500).json({ message: "Failed to fetch or save coin data." });
  }
});

// 🟢 POST /api/history — Save snapshot of current coins
router.post('/history', async (req, res) => {
  try {
    const currentData = await Coin.find();
    await History.insertMany(currentData);
    console.log("🕓 History snapshot recorded");
    res.status(201).json({ message: 'History recorded' });
  } catch (err) {
    console.error("❌ Error saving history:", err.message);
    res.status(500).json({ message: "Failed to record history." });
  }
});

// 🟢 GET /api/history/:coinId — Fetch history for 1 coin
router.get('/history/:coinId', async (req, res) => {
  try {
    const records = await History.find({ coinId: req.params.coinId }).sort({ lastUpdated: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching history:", err.message);
    res.status(500).json({ message: "Failed to fetch history." });
  }
});

module.exports = router;

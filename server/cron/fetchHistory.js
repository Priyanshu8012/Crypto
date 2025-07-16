const cron = require('node-cron');
const axios = require('axios');
const History = require('../models/History');

const Coin = require('../models/Coin');
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

const startCron = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔁 Running cron job: fetch history');
    try {
      const { data } = await axios.get(API_URL);
      const cleaned = data.map(c => ({
        coinId: c.id,
        name: c.name,
        symbol: c.symbol,
        price: c.current_price,
        marketCap: c.market_cap,
        change24h: c.price_change_percentage_24h,
        lastUpdated: c.last_updated,
      }));
      await History.insertMany(cleaned);
      console.log('✅ History stored.');
    } catch (err) {
      console.error('❌ Cron Error:', err.message);
    }
  });
};

module.exports = startCron;

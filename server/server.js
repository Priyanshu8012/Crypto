require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const coinRoutes = require('./routes/coinRoutes');
const startCron = require('./cron/fetchHistory');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', coinRoutes);

// 🟢 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB'); // ✅ Connection message
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
    startCron(); // 🕐 Start cron job after DB is ready
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

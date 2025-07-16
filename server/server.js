const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const coinRoutes = require('./routes/coinRoutes'); // adjust if path is different

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Root route for testing Render
app.get('/', (req, res) => {
  res.send('Crypto API is running...');
});

// Mount API routes
app.use('/api', coinRoutes);

// MongoDB Connection and Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

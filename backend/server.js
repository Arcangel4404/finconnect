const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/calc', require('./routes/calcRoutes'));
app.use('/api/bank', require('./routes/bankRoutes'));
app.use('/api/schemes', require('./routes/schemesRoutes'));
app.use('/api/mf', require('./routes/mfRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/fraud', require('./routes/fraudRoutes'));
app.use('/api/recommendations', require('./routes/recommendationsRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinConnect API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 FinConnect API server running on port ${PORT}`);
});


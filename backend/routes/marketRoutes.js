const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// Market Data (crypto, stocks, forex)
router.get('/summary', marketController.getMarketSummary);
router.get('/crypto/:id', marketController.getCryptoData);
router.get('/stock/:symbol', marketController.getStockData);
router.get('/forex', marketController.getForexData);

module.exports = router;


// Market Data Controller
const marketData = require('../utils/marketData');

exports.getMarketSummary = async (req, res) => {
  try {
    const summary = await marketData.getMarketSummary();
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch market summary'
    });
  }
};

exports.getCryptoData = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cryptocurrency ID is required'
      });
    }
    
    const cryptoData = await marketData.getCryptoData(id);
    
    res.json({
      success: true,
      data: cryptoData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch cryptocurrency data'
    });
  }
};

exports.getStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Stock symbol is required'
      });
    }
    
    const stockData = await marketData.getStockData(symbol);
    
    res.json({
      success: true,
      data: stockData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch stock data'
    });
  }
};

// Forex endpoint
exports.getForexData = async (req, res) => {
  try {
    const { base = 'USD', target = 'INR' } = req.query;
    
    const forexData = await marketData.getForexData(base.toUpperCase(), target.toUpperCase());
    
    res.json({
      success: true,
      data: forexData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch forex data'
    });
  }
};


// Fraud Detection Controller
const fraudDetection = require('../utils/fraudDetection');

exports.analyzeTransaction = (req, res) => {
  try {
    const { transactionData, userProfile, transactionHistory } = req.body;
    
    if (!transactionData) {
      return res.status(400).json({
        success: false,
        error: 'Transaction data is required'
      });
    }
    
    // Validate required fields
    if (transactionData.amount === undefined || !transactionData.timestamp) {
      return res.status(400).json({
        success: false,
        error: 'Transaction amount and timestamp are required'
      });
    }
    
    // Analyze transaction using fraud detection utility
    const analysis = fraudDetection.analyzeTransaction(
      transactionData,
      userProfile || {},
      transactionHistory || []
    );
    
    res.json({
      success: true,
      data: {
        transactionId: transactionData.transactionId || `TXN${Date.now()}`,
        ...analysis
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze transaction'
    });
  }
};


const express = require('express');
const router = express.Router();
const fraudController = require('../controllers/fraudController');

// Fraud Detection
router.post('/analyze', fraudController.analyzeTransaction);

module.exports = router;


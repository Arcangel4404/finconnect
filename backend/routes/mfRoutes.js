const express = require('express');
const router = express.Router();
const mfController = require('../controllers/mfController');

// Mutual Fund (SEBI)
router.get('/:schemeCode', mfController.getMFDetails);

module.exports = router;


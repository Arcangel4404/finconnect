const express = require('express');
const router = express.Router();
const schemesController = require('../controllers/schemesController');

// Government Schemes
router.post('/eligibility', schemesController.checkEligibility);

module.exports = router;


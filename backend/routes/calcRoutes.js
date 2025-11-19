const express = require('express');
const router = express.Router();
const calcController = require('../controllers/calcController');

// Financial Calculators
router.post('/pf', calcController.calculatePF);
router.post('/tax', calcController.calculateTax);
router.post('/emi', calcController.calculateEMI);
router.post('/sip', calcController.calculateSIP);

module.exports = router;


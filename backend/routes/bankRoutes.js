const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

// IFSC / MICR Lookup
router.get('/ifsc/:code', bankController.getIFSCDetails);

module.exports = router;


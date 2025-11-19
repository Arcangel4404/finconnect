const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');

// Recommendations
router.post('/', recommendationsController.getRecommendations);

module.exports = router;


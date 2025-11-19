// Recommendations Controller
const recommendationsEngine = require('../utils/recommendations');

exports.getRecommendations = (req, res) => {
  try {
    const { userProfile } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        error: 'User profile is required'
      });
    }
    
    // Generate recommendations using recommendation engine
    const recommendations = recommendationsEngine.generateRecommendations(userProfile);
    
    res.json({
      success: true,
      data: {
        userProfile,
        ...recommendations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recommendations'
    });
  }
};


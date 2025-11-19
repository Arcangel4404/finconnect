// Government Schemes Controller
const governmentSchemes = require('../utils/governmentSchemes');

exports.checkEligibility = (req, res) => {
  try {
    const { scheme, userData } = req.body;
    
    if (!scheme) {
      return res.status(400).json({
        success: false,
        error: 'Scheme name is required'
      });
    }
    
    if (!userData) {
      return res.status(400).json({
        success: false,
        error: 'User data is required'
      });
    }
    
    let schemeInfo;
    
    switch (scheme.toLowerCase()) {
      case 'pmay':
        schemeInfo = governmentSchemes.checkPMAY(userData);
        break;
      case 'pmjjby':
        schemeInfo = governmentSchemes.checkPMJJBY(userData);
        break;
      case 'pmsby':
        schemeInfo = governmentSchemes.checkPMSBY(userData);
        break;
      case 'apy':
      case 'atal-pension':
        schemeInfo = governmentSchemes.checkAPY(userData);
        break;
      case 'scholarships':
      case 'scholarship':
        schemeInfo = governmentSchemes.checkScholarships(userData);
        break;
      case 'all':
        schemeInfo = {
          schemes: governmentSchemes.checkAllSchemes(userData),
          userData,
          checkedAt: new Date().toISOString()
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown scheme: ${scheme}. Supported schemes: pmay, pmjjby, pmsby, apy, scholarships, all`
        });
    }
    
    res.json({
      success: true,
      data: schemeInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check eligibility'
    });
  }
};


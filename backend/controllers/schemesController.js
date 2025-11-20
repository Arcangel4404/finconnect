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
      case 'pmkisan':
      case 'pm-kisan':
        schemeInfo = governmentSchemes.checkPMKISAN(userData);
        break;
      case 'ayushman':
      case 'pm-jay':
      case 'ayushman-bharat':
        schemeInfo = governmentSchemes.checkAyushmanBharat(userData);
        break;
      case 'ujjwala':
      case 'pm-ujjwala':
        schemeInfo = governmentSchemes.checkUjjwala(userData);
        break;
      case 'standup':
      case 'stand-up-india':
        schemeInfo = governmentSchemes.checkStandUpIndia(userData);
        break;
      case 'mudra':
        schemeInfo = governmentSchemes.checkMUDRA(userData);
        break;
      case 'matruvandana':
      case 'pmmvy':
        schemeInfo = governmentSchemes.checkMatruVandana(userData);
        break;
      case 'pmkmy':
      case 'pm-kmy':
        schemeInfo = governmentSchemes.checkPMKMY(userData);
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
          error: `Unknown scheme: ${scheme}. Supported schemes: pmay, pmjjby, pmsby, apy, scholarships, pmkisan, ayushman, ujjwala, standup, mudra, matruvandana, pmkmy, all`
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


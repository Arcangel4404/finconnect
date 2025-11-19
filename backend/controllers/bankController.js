// Bank IFSC/MICR Lookup Controller
const ifscLookup = require('../utils/ifscLookup');

exports.getIFSCDetails = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Validate IFSC code format
    if (!code || code.length !== 11) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IFSC code. IFSC code must be 11 characters long.'
      });
    }
    
    // Get IFSC details from utility
    const bankData = await ifscLookup.getIFSCDetails(code);
    
    if (!bankData) {
      return res.status(404).json({
        success: false,
        error: 'IFSC code not found. Please verify the code and try again.'
      });
    }
    
    res.json({
      success: true,
      data: bankData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch IFSC details'
    });
  }
};


// Mutual Fund (SEBI) Controller
const axios = require('axios');

exports.getMFDetails = async (req, res) => {
  try {
    const { schemeCode } = req.params;
    
    if (!schemeCode) {
      return res.status(400).json({
        success: false,
        error: 'Scheme code is required'
      });
    }
    
    // Fetch from SEBI Mutual Fund API
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
      timeout: 10000
    });
    
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mutual fund scheme not found'
      });
    }
    
    const mfData = response.data;
    const latestNav = mfData.data[0];
    const previousNav = mfData.data[1] || latestNav;
    
    // Calculate returns
    const nav = parseFloat(latestNav.nav);
    const prevNav = parseFloat(previousNav.nav);
    const navChange = nav - prevNav;
    const navChangePercent = ((navChange / prevNav) * 100).toFixed(2);
    
    // Calculate returns from historical data
    const returns = calculateReturns(mfData.data);
    
    res.json({
      success: true,
      data: {
        schemeCode: schemeCode,
        schemeName: mfData.meta?.scheme_name || 'Unknown Scheme',
        amc: mfData.meta?.fund_house || 'Unknown AMC',
        nav: nav,
        navDate: latestNav.date,
        navChange: navChange,
        navChangePercent: parseFloat(navChangePercent),
        returns: returns,
        fundType: mfData.meta?.scheme_type || 'Unknown',
        category: mfData.meta?.scheme_category || 'Unknown',
        sipAvailable: true,
        minInvestment: 500, // Standard minimum
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Mutual fund scheme not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch mutual fund data'
    });
  }
};

/**
 * Calculate returns from NAV history
 */
function calculateReturns(navData) {
  if (!navData || navData.length < 2) {
    return {
      oneYear: 0,
      threeYear: 0,
      fiveYear: 0
    };
  }
  
  const currentNav = parseFloat(navData[0].nav);
  const currentDate = new Date(navData[0].date);
  
  // Find NAV from 1 year ago
  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const threeYearsAgo = new Date(currentDate);
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  
  const fiveYearsAgo = new Date(currentDate);
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
  const getNavByDate = (targetDate) => {
    const nav = navData.find(item => {
      const itemDate = new Date(item.date);
      return itemDate <= targetDate;
    });
    return nav ? parseFloat(nav.nav) : null;
  };
  
  const oneYearNav = getNavByDate(oneYearAgo);
  const threeYearNav = getNavByDate(threeYearsAgo);
  const fiveYearNav = getNavByDate(fiveYearsAgo);
  
  return {
    oneYear: oneYearNav ? ((currentNav - oneYearNav) / oneYearNav * 100).toFixed(2) : 0,
    threeYear: threeYearNav ? ((currentNav - threeYearNav) / threeYearNav * 100).toFixed(2) : 0,
    fiveYear: fiveYearNav ? ((currentNav - fiveYearNav) / fiveYearNav * 100).toFixed(2) : 0
  };
}


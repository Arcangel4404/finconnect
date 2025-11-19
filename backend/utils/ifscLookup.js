// IFSC Lookup Utility
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// In-memory cache for IFSC data
let ifscCache = new Map();
let isInitialized = false;

/**
 * Initialize IFSC data from API or CSV
 * Uses Razorpay IFSC API as fallback to RBI data
 */
async function initializeIFSCData() {
  if (isInitialized) return;
  
  try {
    // Try to load from CSV file if exists (RBI IFSC dump)
    const csvPath = path.join(__dirname, '../data/IFSC.csv');
    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n');
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',');
        if (columns.length >= 11) {
          const ifsc = columns[0]?.replace(/"/g, '').toUpperCase();
          if (ifsc && ifsc.length === 11) {
            ifscCache.set(ifsc, {
              ifsc: ifsc,
              bank: columns[1]?.replace(/"/g, '') || '',
              branch: columns[2]?.replace(/"/g, '') || '',
              address: columns[3]?.replace(/"/g, '') || '',
              city: columns[4]?.replace(/"/g, '') || '',
              district: columns[5]?.replace(/"/g, '') || '',
              state: columns[6]?.replace(/"/g, '') || '',
              pincode: columns[7]?.replace(/"/g, '') || '',
              contact: columns[8]?.replace(/"/g, '') || '',
              micr: columns[9]?.replace(/"/g, '') || '',
              upi: columns[10]?.includes('Y') || false,
              rtgs: true,
              neft: true,
              imps: true
            });
          }
        }
      }
      console.log(`Loaded ${ifscCache.size} IFSC codes from CSV`);
      isInitialized = true;
      return;
    }
  } catch (error) {
    console.warn('Could not load IFSC from CSV:', error.message);
  }
  
  // If CSV not available, use API-based lookup (lazy loading)
  isInitialized = true;
}

/**
 * Get IFSC details from cache or API
 */
async function getIFSCDetails(ifscCode) {
  await initializeIFSCData();
  
  const upperIFSC = ifscCode.toUpperCase();
  
  // Check cache first
  if (ifscCache.has(upperIFSC)) {
    return ifscCache.get(upperIFSC);
  }
  
  // If not in cache, try API lookup (Razorpay IFSC API)
  try {
    const response = await axios.get(`https://ifsc.razorpay.com/${upperIFSC}`, {
      timeout: 5000
    });
    
    if (response.data && response.data.IFSC) {
      const bankData = {
        ifsc: response.data.IFSC,
        bank: response.data.BANK || '',
        branch: response.data.BRANCH || '',
        address: response.data.ADDRESS || '',
        city: response.data.CITY || '',
        district: response.data.DISTRICT || '',
        state: response.data.STATE || '',
        pincode: response.data.PINCODE || '',
        contact: response.data.CONTACT || '',
        micr: response.data.MICR || '',
        upi: response.data.UPI === true,
        rtgs: response.data.RTGS === true || true,
        neft: response.data.NEFT === true || true,
        imps: response.data.IMPS === true || true
      };
      
      // Cache for future use
      ifscCache.set(upperIFSC, bankData);
      return bankData;
    }
  } catch (error) {
    console.warn(`IFSC API lookup failed for ${upperIFSC}:`, error.message);
  }
  
  return null;
}

module.exports = {
  initializeIFSCData,
  getIFSCDetails
};


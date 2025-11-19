// Market Data Integration Utilities
const axios = require('axios');

/**
 * Get crypto data from CoinGecko API
 */
async function getCryptoData(cryptoId) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId.toLowerCase()}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: false
      },
      timeout: 10000
    });
    
    const data = response.data;
    const currentPrice = data.market_data?.current_price?.inr || 0;
    const priceChange24h = data.market_data?.price_change_24h_in_currency?.inr || 0;
    const priceChangePercent24h = data.market_data?.price_change_percentage_24h || 0;
    
    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      currentPrice,
      change24h: priceChange24h,
      changePercent24h: parseFloat(priceChangePercent24h.toFixed(2)),
      high24h: data.market_data?.high_24h?.inr || 0,
      low24h: data.market_data?.low_24h?.inr || 0,
      volume24h: data.market_data?.total_volume?.inr || 0,
      marketCap: data.market_data?.market_cap?.inr || 0,
      marketCapRank: data.market_cap_rank || 0,
      lastUpdated: data.last_updated
    };
  } catch (error) {
    console.error(`CoinGecko API error for ${cryptoId}:`, error.message);
    throw new Error(`Failed to fetch crypto data: ${error.message}`);
  }
}

/**
 * Get forex data from ER-API (Exchange Rate API)
 */
async function getForexData(baseCurrency = 'USD', targetCurrency = 'INR') {
  try {
    // Using exchangerate-api.com (free tier)
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
      timeout: 10000
    });
    
    const rate = response.data.rates[targetCurrency] || 0;
    const timestamp = response.data.date;
    
    return {
      base: baseCurrency,
      target: targetCurrency,
      rate,
      timestamp,
      pair: `${baseCurrency}/${targetCurrency}`
    };
  } catch (error) {
    console.error(`Forex API error:`, error.message);
    // Fallback to mock data
    return {
      base: baseCurrency,
      target: targetCurrency,
      rate: baseCurrency === 'USD' && targetCurrency === 'INR' ? 83.0 : 1.0,
      timestamp: new Date().toISOString().split('T')[0],
      pair: `${baseCurrency}/${targetCurrency}`
    };
  }
}

/**
 * Get stock data from Alpha Vantage (free tier, requires API key)
 * Falls back to NSE API if Alpha Vantage key not provided
 */
async function getStockData(symbol) {
  try {
    const stockSymbol = symbol.toUpperCase();
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    
    // Try Alpha Vantage first (more reliable)
    if (apiKey && apiKey !== 'demo') {
      try {
        // Alpha Vantage uses format: SYMBOL.BSE or SYMBOL.NSE
        const avUrl = `https://www.alphavantage.co/query`;
        const avResponse = await axios.get(avUrl, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: `${stockSymbol}.BSE`,
            apikey: apiKey
          },
          timeout: 8000
        });
        
        if (avResponse.data && avResponse.data['Global Quote'] && Object.keys(avResponse.data['Global Quote']).length > 0) {
          const quote = avResponse.data['Global Quote'];
          const currentPrice = parseFloat(quote['05. price'] || 0);
          const previousClose = parseFloat(quote['08. previous close'] || 0);
          const change = currentPrice - previousClose;
          const changePercent = previousClose > 0 ? ((change / previousClose) * 100) : 0;
          const high = parseFloat(quote['03. high'] || 0);
          const low = parseFloat(quote['04. low'] || 0);
          const open = parseFloat(quote['02. open'] || 0);
          const volume = parseFloat(quote['06. volume'] || 0);
          
          return {
            symbol: stockSymbol,
            name: quote['01. symbol'] || `${stockSymbol} Ltd`,
            exchange: 'NSE',
            currentPrice: currentPrice,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            high: high,
            low: low,
            open: open,
            previousClose: previousClose,
            volume: volume,
            marketCap: null,
            pe: null,
            eps: null,
            dividendYield: null,
            lastUpdated: quote['07. latest trading day'] || new Date().toISOString()
          };
        }
      } catch (avError) {
        console.error(`Alpha Vantage error for ${symbol}:`, avError.message);
      }
    }
    
    // Fallback: Try NSE India's public API (may require cookies/session)
    try {
      // First, get a session cookie by visiting the main page
      const sessionResponse = await axios.get('https://www.nseindia.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 5000,
        maxRedirects: 5
      });
      
      const cookies = sessionResponse.headers['set-cookie'];
      const cookieString = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';
      
      // Now fetch the stock data with the session cookie
      const nseUrl = `https://www.nseindia.com/api/quote-equity?symbol=${stockSymbol}`;
      const nseResponse = await axios.get(nseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.nseindia.com/get-quotes/equity?symbol=' + stockSymbol,
          'Origin': 'https://www.nseindia.com',
          'Cookie': cookieString
        },
        timeout: 8000
      });
      
      if (nseResponse.data && nseResponse.data.info) {
        const info = nseResponse.data.info;
        const priceInfo = nseResponse.data.priceInfo || {};
        
        const currentPrice = priceInfo.lastPrice || priceInfo.lastTradedPrice || 0;
        const previousClose = priceInfo.previousClose || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose > 0 ? ((change / previousClose) * 100) : 0;
        
        return {
          symbol: stockSymbol,
          name: info.companyName || info.symbol || `${stockSymbol} Ltd`,
          exchange: 'NSE',
          currentPrice: parseFloat(currentPrice),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          high: priceInfo.intraDayHighLow?.max || priceInfo.dayHigh || currentPrice,
          low: priceInfo.intraDayHighLow?.min || priceInfo.dayLow || currentPrice,
          open: priceInfo.open || currentPrice,
          previousClose: parseFloat(previousClose),
          volume: priceInfo.totalTradedVolume || 0,
          marketCap: info.marketCap || null,
          pe: info.pE || null,
          eps: null,
          dividendYield: null,
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (nseError) {
      console.error(`NSE API error for ${symbol}:`, nseError.message);
    }
    
    // Final fallback: Use mock data with realistic variations
    const mockData = {
      'RELIANCE': { base: 2456.78, name: 'Reliance Industries Ltd' },
      'TCS': { base: 3456.12, name: 'Tata Consultancy Services Ltd' },
      'INFY': { base: 1567.89, name: 'Infosys Ltd' },
      'HDFCBANK': { base: 1654.32, name: 'HDFC Bank Ltd' },
      'ICICIBANK': { base: 987.65, name: 'ICICI Bank Ltd' }
    };
    
    const stockInfo = mockData[stockSymbol] || { base: 1000.00, name: `${stockSymbol} Ltd` };
    const timeOfDay = new Date().getHours();
    const isMarketOpen = timeOfDay >= 9 && timeOfDay < 16;
    const variation = isMarketOpen ? (Math.random() - 0.5) * 50 : 0;
    const currentPrice = stockInfo.base + variation;
    const previousClose = stockInfo.base;
    const change = currentPrice - previousClose;
    const changePercent = ((change / previousClose) * 100);
    
    return {
      symbol: stockSymbol,
      name: stockInfo.name,
      exchange: 'NSE',
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: parseFloat((currentPrice + Math.abs(variation * 0.5)).toFixed(2)),
      low: parseFloat((currentPrice - Math.abs(variation * 0.5)).toFixed(2)),
      open: parseFloat((previousClose + variation * 0.3).toFixed(2)),
      previousClose: previousClose,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      marketCap: null,
      pe: null,
      eps: null,
      dividendYield: null,
      note: isMarketOpen ? 'Using simulated data' : 'Market closed - Using simulated data'
    };
  } catch (error) {
    console.error(`Stock data error for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch stock data: ${error.message}`);
  }
}

/**
 * Get NSE indices (Sensex and Nifty) from NSE India's public API
 */
async function getNSEIndices() {
  try {
    // First, get a session cookie
    let cookieString = '';
    try {
      const sessionResponse = await axios.get('https://www.nseindia.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 5000,
        maxRedirects: 5
      });
      
      const cookies = sessionResponse.headers['set-cookie'];
      if (cookies) {
        cookieString = cookies.map(c => c.split(';')[0]).join('; ');
      }
    } catch (cookieError) {
      console.error('Failed to get NSE session cookie:', cookieError.message);
    }
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.nseindia.com/',
      'Origin': 'https://www.nseindia.com'
    };
    
    if (cookieString) {
      headers['Cookie'] = cookieString;
    }
    
    // Try NSE API with proper headers and cookies
    try {
      // Fetch Nifty from NSE
      const niftyResponse = await Promise.allSettled([
        axios.get('https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050', { headers, timeout: 8000 })
      ]);
      
      // Fetch Sensex from BSE (Sensex is BSE index, not NSE)
      // Try BSE API or use a free API that provides Sensex
      let sensexResponse = { status: 'rejected', reason: new Error('Sensex fetch not attempted') };
      
      // Try BSE's public API for Sensex
      try {
        // BSE Sensex is typically at ^BSESN in Yahoo Finance or other APIs
        // For now, try a simple BSE API endpoint or use a proxy
        const bseUrl = 'https://api.bseindia.com/BseIndiaAPI/api/GetIndexValue/w?indexid=1'; // 1 = SENSEX
        const bseResponse = await axios.get(bseUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          },
          timeout: 5000
        });
        
        if (bseResponse.data && bseResponse.data.value) {
          // BSE API returns different format - check various possible response structures
        const sensexValue = parseFloat(bseResponse.data.value || bseResponse.data.currentValue || bseResponse.data.CurrentValue || 0);
        const previousValue = parseFloat(bseResponse.data.previousClose || bseResponse.data.PreviousClose || sensexValue);
        
        if (sensexValue > 0) {
          const change = sensexValue - previousValue;
          const changePercent = previousValue > 0 ? ((change / previousValue) * 100) : 0;
          
          sensexResponse = {
            status: 'fulfilled',
            value: {
              data: {
                value: sensexValue,
                previousClose: previousValue,
                open: parseFloat(bseResponse.data.open || bseResponse.data.Open || previousValue)
              }
            }
          };
        }
        }
      } catch (bseError) {
        // BSE API failed, Sensex response remains rejected
        console.error('BSE Sensex API error:', bseError.message);
      }
      
      let niftyData = null;
      let sensexData = null;
      
      if (niftyResponse[0].status === 'fulfilled' && niftyResponse[0].value?.data?.data?.length > 0) {
        const data = niftyResponse[0].value.data.data[0];
        if (data.lastPrice) {
          const current = parseFloat(data.lastPrice);
          const previous = parseFloat(data.previousClose || data.open || current);
          const change = current - previous;
          const changePercent = previous > 0 ? ((change / previous) * 100) : 0;
          
          niftyData = {
            value: current,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          };
        }
      }
      
      // Parse Sensex from BSE response if available
      if (sensexResponse.status === 'fulfilled') {
        if (sensexResponse.value?.data?.data?.length > 0) {
          // NSE-style response
          const data = sensexResponse.value.data.data[0];
          if (data.lastPrice) {
            const current = parseFloat(data.lastPrice);
            const previous = parseFloat(data.previousClose || data.open || current);
            const change = current - previous;
            const changePercent = previous > 0 ? ((change / previous) * 100) : 0;
            
            sensexData = {
              value: current,
              change: parseFloat(change.toFixed(2)),
              changePercent: parseFloat(changePercent.toFixed(2))
            };
          }
        } else if (sensexResponse.value?.data?.value) {
          // BSE API response format
          const current = parseFloat(sensexResponse.value.data.value);
          const previous = parseFloat(sensexResponse.value.data.previousClose || current);
          const change = current - previous;
          const changePercent = previous > 0 ? ((change / previous) * 100) : 0;
          
          sensexData = {
            value: current,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          };
        }
      }
      
      // If we got real data, return it
      if (niftyData || sensexData) {
        return {
          nifty: niftyData || { value: 19543.25, change: 78.90, changePercent: 0.41, note: 'Using fallback' },
          sensex: sensexData || { value: 65432.10, change: 234.56, changePercent: 0.36, note: 'Using fallback' }
        };
      }
    } catch (nseError) {
      console.error('NSE Indices API error:', nseError.message);
    }
    
    // Fallback: Use realistic simulated data based on market hours
    const timeOfDay = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    const isMarketOpen = (dayOfWeek >= 1 && dayOfWeek <= 5) && (timeOfDay >= 9 && timeOfDay < 16);
    
    const baseNifty = 19543.25;
    const baseSensex = 65432.10;
    
    // Add realistic variation if market is open
    const niftyVariation = isMarketOpen ? (Math.random() - 0.5) * 150 : (Math.random() - 0.5) * 20;
    const sensexVariation = isMarketOpen ? (Math.random() - 0.5) * 400 : (Math.random() - 0.5) * 50;
    
    return {
      nifty: {
        value: parseFloat((baseNifty + niftyVariation).toFixed(2)),
        change: parseFloat(niftyVariation.toFixed(2)),
        changePercent: parseFloat(((niftyVariation / baseNifty) * 100).toFixed(2)),
        note: isMarketOpen ? 'Market open - Using simulated data' : 'Market closed - Using simulated data'
      },
      sensex: {
        value: parseFloat((baseSensex + sensexVariation).toFixed(2)),
        change: parseFloat(sensexVariation.toFixed(2)),
        changePercent: parseFloat(((sensexVariation / baseSensex) * 100).toFixed(2)),
        note: isMarketOpen ? 'Market open - Using simulated data' : 'Market closed - Using simulated data'
      }
    };
  } catch (error) {
    console.error('Get NSE Indices error:', error.message);
    return {
      sensex: { value: 65432.10, change: 234.56, changePercent: 0.36, note: 'Using fallback data' },
      nifty: { value: 19543.25, change: 78.90, changePercent: 0.41, note: 'Using fallback data' }
    };
  }
}

/**
 * Get market summary (crypto, stocks, forex, NSE indices)
 */
async function getMarketSummary() {
  try {
    // Get top cryptocurrencies
    const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'inr',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false
      },
      timeout: 10000
    });
    
    const topCrypto = cryptoResponse.data.slice(0, 5).map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_24h,
      changePercent24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap
    }));
    
    // Get forex rates
    const usdInr = await getForexData('USD', 'INR');
    const eurInr = await getForexData('EUR', 'INR');
    
    // Get NSE indices (real-time)
    const indices = await getNSEIndices();
    
    return {
      timestamp: new Date().toISOString(),
      crypto: {
        top5: topCrypto
      },
      forex: {
        usdInr: usdInr.rate,
        eurInr: eurInr.rate,
        updatedAt: usdInr.timestamp
      },
      indices: indices
    };
  } catch (error) {
    console.error('Market summary error:', error.message);
    // Return with fallback data
    return {
      timestamp: new Date().toISOString(),
      crypto: {
        top5: []
      },
      forex: {
        usdInr: 83.25,
        eurInr: 90.50,
        updatedAt: new Date().toISOString().split('T')[0]
      },
      indices: {
        sensex: {
          value: 65432.10,
          change: 234.56,
          changePercent: 0.36,
          note: 'Using fallback data'
        },
        nifty: {
          value: 19543.25,
          change: 78.90,
          changePercent: 0.41,
          note: 'Using fallback data'
        }
      }
    };
  }
}

module.exports = {
  getCryptoData,
  getForexData,
  getStockData,
  getMarketSummary
};


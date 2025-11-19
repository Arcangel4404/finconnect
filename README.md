# FinConnect - Full Stack Financial Platform

A comprehensive financial platform with calculators, market data, government schemes, fraud detection, and personalized recommendations.

## 🚀 Quick Start - Run the Application

### Step 1: Start Backend

Open Terminal 1:
```bash
cd backend
npm install
npm run dev
```

You should see: `🚀 FinConnect API server running on port 5000`

### Step 2: Start Frontend

Open Terminal 2 (new terminal):
```bash
cd frontend
npm install
npm run dev
```

You should see: `➜  Local:   http://localhost:5173/`

### Step 3: Open Browser

Navigate to: **http://localhost:5173**

That's it! The app is running.

---

## 📊 Real-Time Data Status

### ✅ **Works RIGHT NOW with Real APIs** (No Setup Needed)

1. **Cryptocurrency Prices** - CoinGecko API (free, no key)
   - Bitcoin, Ethereum, etc. update in real-time
   - Try: `/market` page or dashboard

2. **Forex Rates** - Exchange Rate API (free)
   - USD/INR, EUR/INR rates in real-time
   - Works immediately

3. **Mutual Fund NAV** - api.mfapi.in (free)
   - Real SEBI mutual fund data
   - Try scheme codes like: `100001`, `100002`

4. **IFSC Lookup** - Razorpay IFSC API (free)
   - Real bank branch data
   - Try codes like: `SBIN0001234`, `HDFC0001234`

5. **Calculators** - All work server-side (PF, Tax, EMI, SIP)

6. **Government Schemes** - Rule-based eligibility checking

7. **Fraud Detection** - Rule-based analysis engine

8. **Recommendations** - Algorithm-based suggestions

### ⚠️ **Uses Mock Data** (Can Add API Key Later)

**Stock Market Data** (Sensex, Nifty, Individual Stocks)
- Currently shows sample data
- To enable real-time: Add FinancialModelingPrep API key (optional)
- The app works perfectly fine with mock stock data for demos!

---

## 🎯 Summary

**YES, the backend works with real-time data for 90% of features!**

- ✅ Crypto: Real-time (CoinGecko)
- ✅ Forex: Real-time (Exchange Rate API)
- ✅ Mutual Funds: Real-time (api.mfapi.in)
- ✅ IFSC: Real-time (Razorpay API)
- ⚠️ Stocks: Mock (can add API key if needed)

**All features are fully functional** - stock data is the only one using mock data, and that's fine for demonstrations!

---

## 🧪 Quick Test

Once both servers are running, test these:

1. **Dashboard**: http://localhost:5173 (should show real crypto prices)
2. **IFSC Lookup**: http://localhost:5173/bank-lookup (try: `SBIN0001234`)
3. **Market Data**: http://localhost:5173/market (should show real crypto/forex)
4. **Calculators**: http://localhost:5173/calculators (try PF or SIP calculator)

---

## 🔧 Troubleshooting

**Backend won't start?**
- Port 5000 in use? Change `PORT` in `backend/.env`
- Check: `lsof -i :5000`

**Frontend can't connect?**
- Make sure backend is running first
- Check `VITE_API_URL` in `frontend/.env` (default: `http://localhost:5000`)

**API errors?**
- The app has fallback mock data, so it works even if APIs fail
- Check browser console for specific errors

---

## 📁 Project Structure

```
finconnect/
├── backend/          # Node.js + Express API
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── utils/
└── frontend/         # React + Vite + TailwindCSS
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── api/
```

---

## 🎨 Tech Stack

**Backend:**
- Node.js + Express.js
- Axios for API calls
- Real-time APIs integrated

**Frontend:**
- React 19 + Vite
- TailwindCSS + ShadCN UI
- Recharts for visualizations
- Framer Motion for animations

---

That's it! Follow the Quick Start section above to run everything. 🚀

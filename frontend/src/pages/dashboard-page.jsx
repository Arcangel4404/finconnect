import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { TrendingUp, TrendingDown, Wallet, DollarSign, Shield, BarChart3, Newspaper, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import { marketAPI } from '../api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'

const stats = [
  { name: 'Total Portfolio', value: '₹12,45,678', change: '+12.5%', trend: 'up', icon: Wallet },
  { name: 'Monthly Savings', value: '₹45,000', change: '+8.2%', trend: 'up', icon: DollarSign },
  { name: 'Tax Savings', value: '₹1,50,000', change: 'Maxed', trend: 'neutral', icon: DollarSign },
  { name: 'Protection Score', value: '85/100', change: '+5', trend: 'up', icon: Shield },
]

// Mock stock trends data
const stockTrends = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.78, change: 2.37, changePercent: 2.37 },
  { symbol: 'TCS', name: 'Tata Consultancy', price: 3456.12, change: 1.34, changePercent: 1.34 },
  { symbol: 'INFY', name: 'Infosys', price: 1567.89, change: -1.23, changePercent: -1.23 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1654.32, change: 0.89, changePercent: 0.89 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 987.65, change: -0.45, changePercent: -0.45 },
]

// Mock news cards
const newsItems = [
  {
    id: 1,
    title: 'Indian Stock Markets Hit All-Time High',
    description: 'Sensex crosses 66,000 mark as investor confidence grows',
    category: 'Markets',
    time: '2 hours ago',
    trend: 'up'
  },
  {
    id: 2,
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%',
    description: 'Central bank maintains status quo for fourth consecutive meeting',
    category: 'Banking',
    time: '5 hours ago',
    trend: 'neutral'
  },
  {
    id: 3,
    title: 'Crypto Market Surges as Bitcoin Hits New Highs',
    description: 'Bitcoin crosses $42,000 amid institutional adoption',
    category: 'Crypto',
    time: '1 day ago',
    trend: 'up'
  },
]

// Mock crypto mini charts data
const cryptoMiniCharts = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 3425678.50,
    change: 2.45,
    data: [3400000, 3410000, 3420000, 3415000, 3425678]
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 245678.90,
    change: -0.50,
    data: [246000, 245500, 245000, 245800, 245678]
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 45.67,
    change: 1.23,
    data: [44.5, 45.0, 45.2, 45.5, 45.67]
  }
]

// Function to generate intraday chart data
function generateIntradayChartData(currentValue) {
  const times = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const baseValue = currentValue || 19500;
  
  return times.map((time, index) => {
    const variation = (Math.random() - 0.5) * 200;
    const trend = (index / times.length) * 100; // Slight upward trend
    return {
      time,
      value: baseValue + variation + trend
    };
  });
}

// Fallback market data
const fallbackMarketData = {
  data: {
    crypto: {
      top5: cryptoMiniCharts.map(crypto => ({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.price,
        changePercent24h: crypto.change
      }))
    },
    forex: {
      usdInr: 83.25,
      eurInr: 90.50,
      gbpInr: 92.50
    },
    indices: {
      sensex: { value: 65900, change: 234.56, changePercent: 0.36 },
      nifty: { value: 19680, change: 78.90, changePercent: 0.41 }
    }
  }
}

export function DashboardPage() {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stockChartData, setStockChartData] = useState([])

  const isMountedRef = useRef(true)
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await marketAPI.summary()
        if (!isMountedRef.current) return
        
        if (response && response.data && response.data.success) {
          // API returns: { success: true, data: { indices: {...}, crypto: {...}, ... } }
          const apiData = response.data.data
          if (isMountedRef.current) {
            setMarketData(apiData)
            
            // Generate chart data from real Nifty value
            if (apiData && apiData.indices && apiData.indices.nifty && apiData.indices.nifty.value) {
              const chartData = generateIntradayChartData(apiData.indices.nifty.value)
              setStockChartData(chartData)
            } else {
              setStockChartData(generateIntradayChartData(19500))
            }
          }
        } else {
          // Use fallback structure
          if (isMountedRef.current) {
            setMarketData(fallbackMarketData.data)
            setStockChartData(generateIntradayChartData(19500))
          }
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error)
        // Use fallback data if API fails - use .data to match structure
        if (isMountedRef.current) {
          setMarketData(fallbackMarketData.data)
          setStockChartData(generateIntradayChartData(19500))
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchMarketData()
    
    // Refresh market data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  // Normalize data structure - marketData is already the data object, or use fallback
  const displayData = marketData || fallbackMarketData.data

  return (
    <div className="space-y-6">
      {/* Page Header with Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-8 border border-primary/20 shadow-lg"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's your financial overview for today.
          </p>
        </div>
      </motion.div>

      {/* Today's Market Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card glass className="border-primary/20">
          <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Today's Market Summary
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Auto-refresh: 30s
            </div>
          </CardTitle>
          <CardDescription>Real-time market updates and indices from NSE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">BSE Sensex</p>
                <p className="text-3xl font-bold">
                  {displayData?.indices?.sensex?.value ? 
                    displayData.indices.sensex.value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) 
                    : '65,900.45'}
                </p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${
                  (displayData?.indices?.sensex?.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(displayData?.indices?.sensex?.changePercent || 0) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {(displayData?.indices?.sensex?.changePercent || 0) >= 0 ? '+' : ''}
                  {(displayData?.indices?.sensex?.change || 0).toFixed(2)} 
                  ({(displayData?.indices?.sensex?.changePercent || 0) >= 0 ? '+' : ''}
                  {(displayData?.indices?.sensex?.changePercent || 0).toFixed(2)}%)
                </p>
                {displayData?.indices?.sensex?.note && (
                  <p className="text-xs text-muted-foreground mt-1">{displayData.indices.sensex.note}</p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">NSE Nifty 50</p>
                <p className="text-3xl font-bold">
                  {displayData?.indices?.nifty?.value ? 
                    displayData.indices.nifty.value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) 
                    : '19,680.12'}
                </p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${
                  (displayData?.indices?.nifty?.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(displayData?.indices?.nifty?.changePercent || 0) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {(displayData?.indices?.nifty?.changePercent || 0) >= 0 ? '+' : ''}
                  {(displayData?.indices?.nifty?.change || 0).toFixed(2)} 
                  ({(displayData?.indices?.nifty?.changePercent || 0) >= 0 ? '+' : ''}
                  {(displayData?.indices?.nifty?.changePercent || 0).toFixed(2)}%)
                </p>
                {displayData?.indices?.nifty?.note && (
                  <p className="text-xs text-muted-foreground mt-1">{displayData.indices.nifty.note}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card 
                glass
                className="hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border-border/50 group"
              >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs mt-1 flex items-center space-x-1 ${
                    stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {stat.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                    <span>{stat.change}</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Stock Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card glass className="hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Top Stock Trends</CardTitle>
            <CardDescription>Today's top performing stocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockTrends.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold">{stock.symbol}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{stock.name}</p>
                      <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{stock.price.toFixed(2)}</p>
                    <p className={`text-sm flex items-center gap-1 justify-end ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Summary - Charts and Crypto */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Crypto Mini Charts */}
        <Card glass className="hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Crypto Mini Charts</CardTitle>
            <CardDescription>24h price movements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cryptoMiniCharts.map((crypto, index) => {
              const chartData = crypto.data.map((val, i) => ({ time: i, value: val }))
              return (
                <motion.div
                  key={crypto.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{crypto.symbol}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">₹{crypto.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <Badge variant={crypto.change >= 0 ? 'default' : 'destructive'} className="text-xs">
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`cryptoGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={crypto.change >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={crypto.change >= 0 ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={crypto.change >= 0 ? '#22c55e' : '#ef4444'}
                        strokeWidth={1.5}
                        fill={`url(#cryptoGradient${index})`}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>

        {/* Stock Mini Chart */}
        <Card glass className="hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Nifty 50 Intraday</CardTitle>
            <CardDescription>Today's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  animationDuration={200}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* News Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card glass className="hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Financial News
            </CardTitle>
            <CardDescription>Latest updates from the financial world</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {newsItems.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {news.category}
                    </Badge>
                    {news.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{news.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{news.description}</p>
                  <p className="text-xs text-muted-foreground">{news.time}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Cryptocurrencies */}
      {displayData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card glass className="hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Top Cryptocurrencies</CardTitle>
              <CardDescription>24h price changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(displayData.data?.crypto?.top5 || cryptoMiniCharts).slice(0, 5).map((crypto, index) => (
                  <motion.div
                    key={crypto.id || crypto.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{crypto.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{crypto.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || crypto.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium flex items-center gap-1 ${
                      (crypto.changePercent24h || crypto.change) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(crypto.changePercent24h || crypto.change) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {(crypto.changePercent24h || crypto.change) >= 0 ? '+' : ''}{(crypto.changePercent24h || crypto.change)?.toFixed(2)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Forex Rates */}
      {displayData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card glass className="hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Forex Rates</CardTitle>
              <CardDescription>Current exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">USD/INR</p>
                    <p className="text-sm text-muted-foreground">US Dollar</p>
                  </div>
                  <div className="text-2xl font-bold">₹{(displayData.data?.forex?.usdInr || 83.25).toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">EUR/INR</p>
                    <p className="text-sm text-muted-foreground">Euro</p>
                  </div>
                  <div className="text-2xl font-bold">₹{(displayData.data?.forex?.eurInr || 90.50).toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">GBP/INR</p>
                    <p className="text-sm text-muted-foreground">British Pound</p>
                  </div>
                  <div className="text-2xl font-bold">₹{(displayData.data?.forex?.gbpInr || 92.50).toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

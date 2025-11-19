import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TrendingUp, TrendingDown, Wallet, DollarSign, Calculator, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { marketAPI } from '../api'

const stats = [
  { name: 'Total Portfolio', value: '₹12,45,678', change: '+12.5%', trend: 'up', icon: Wallet },
  { name: 'Monthly Savings', value: '₹45,000', change: '+8.2%', trend: 'up', icon: DollarSign },
  { name: 'Tax Savings', value: '₹1,50,000', change: 'Maxed', trend: 'neutral', icon: Calculator },
  { name: 'Protection Score', value: '85/100', change: '+5', trend: 'up', icon: Shield },
]

export function Dashboard() {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await marketAPI.summary()
        setMarketData(response.data)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card 
              key={stat.name} 
              className="animate-scale-in hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`
                  text-xs mt-1 flex items-center space-x-1
                  ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}
                `}>
                  {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {stat.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  <span>{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Market Overview */}
      {!loading && marketData && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-scale-in hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Crypto Markets</CardTitle>
              <CardDescription>Top 5 cryptocurrencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.data?.crypto?.top5?.slice(0, 5).map((crypto, index) => (
                  <div 
                    key={crypto.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{crypto.symbol}</span>
                      </div>
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{crypto.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${crypto.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h?.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Forex Rates</CardTitle>
              <CardDescription>Current exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">USD/INR</p>
                    <p className="text-sm text-muted-foreground">US Dollar to Indian Rupee</p>
                  </div>
                  <div className="text-2xl font-bold">₹{marketData.data?.forex?.usdInr?.toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">EUR/INR</p>
                    <p className="text-sm text-muted-foreground">Euro to Indian Rupee</p>
                  </div>
                  <div className="text-2xl font-bold">₹{marketData.data?.forex?.eurInr?.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="animate-scale-in hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Calculate EMI', description: 'Loan EMI calculator', href: '/calculators' },
              { title: 'Check IFSC', description: 'Bank IFSC code lookup', href: '/bank-lookup' },
              { title: 'Scheme Eligibility', description: 'Government schemes', href: '/schemes' },
            ].map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
              >
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


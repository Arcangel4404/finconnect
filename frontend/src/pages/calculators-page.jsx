import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { calcAPI } from '../api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calculator, PiggyBank, CreditCard, TrendingUp, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'

const COLORS = ['hsl(var(--primary))', '#22c55e', '#ef4444', '#f59e0b']

const calculatorOptions = [
  {
    id: 'pf',
    name: 'Provident Fund',
    icon: PiggyBank,
    description: 'Calculate PF balance with yearly compounding',
    color: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/20',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5'
  },
  {
    id: 'tax',
    name: 'Income Tax',
    icon: Receipt,
    description: 'Calculate tax for old or new regime',
    color: 'from-green-500/20 to-green-600/10',
    borderColor: 'border-green-500/20',
    gradient: 'bg-gradient-to-br from-green-500/10 to-green-600/5'
  },
  {
    id: 'emi',
    name: 'EMI',
    icon: CreditCard,
    description: 'Calculate loan EMI and amortization',
    color: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/20',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5'
  },
  {
    id: 'sip',
    name: 'SIP',
    icon: TrendingUp,
    description: 'Calculate SIP returns and future value',
    color: 'from-orange-500/20 to-orange-600/10',
    borderColor: 'border-orange-500/20',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5'
  }
]

export function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('pf')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Calculators</h1>
        <p className="text-muted-foreground">
          Calculate PF, Tax, EMI, and SIP returns
        </p>
      </div>

      {/* Calculator Selection Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {calculatorOptions.map((calc, index) => {
          const Icon = calc.icon
          return (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                glass
                className={`hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border ${calc.borderColor} ${
                  activeTab === calc.id ? 'ring-2 ring-primary shadow-xl' : ''
                } group`}
                onClick={() => setActiveTab(calc.id)}
              >
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg ${calc.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{calc.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`w-full h-1 rounded-full transition-all ${
                    activeTab === calc.id ? 'bg-primary' : 'bg-muted group-hover:bg-primary/50'
                  }`} />
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pf">PF</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="emi">EMI</TabsTrigger>
          <TabsTrigger value="sip">SIP</TabsTrigger>
        </TabsList>

        <TabsContent value="pf" className="space-y-4">
          <PFCalculator />
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <TaxCalculator />
        </TabsContent>

        <TabsContent value="emi" className="space-y-4">
          <EMICalculator />
        </TabsContent>

        <TabsContent value="sip" className="space-y-4">
          <SIPCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PFCalculator() {
  const [formData, setFormData] = useState({ basicSalary: '', da: '', years: '30', rate: '8.1' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) {
      return 'Basic salary must be greater than 0'
    }
    if (formData.da && parseFloat(formData.da) < 0) {
      return 'DA cannot be negative'
    }
    if (!formData.years || parseInt(formData.years) <= 0 || parseInt(formData.years) > 100) {
      return 'Years must be between 1 and 100'
    }
    if (!formData.rate || parseFloat(formData.rate) < 0 || parseFloat(formData.rate) > 20) {
      return 'Interest rate must be between 0 and 20%'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await calcAPI.pf({
        basicSalary: parseFloat(formData.basicSalary),
        da: parseFloat(formData.da) || 0,
        years: parseInt(formData.years),
        rate: parseFloat(formData.rate)
      })
      if (response.data.success) setResult(response.data.data)
    } catch (error) {
      console.error('PF calculation failed:', error)
      alert('Failed to calculate PF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Provident Fund Calculator
          </CardTitle>
          <CardDescription>Calculate your PF balance with yearly compounding</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary (₹)</Label>
              <Input id="basicSalary" type="number" value={formData.basicSalary} onChange={(e) => setFormData({...formData, basicSalary: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="da">DA (₹)</Label>
              <Input id="da" type="number" value={formData.da} onChange={(e) => setFormData({...formData, da: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years">Years</Label>
                <Input id="years" type="number" value={formData.years} onChange={(e) => setFormData({...formData, years: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input id="rate" type="number" step="0.1" value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">Calculate</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card glass className="animate-scale-in">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Final Balance</Label>
              <p className="text-3xl font-bold">₹{result.finalBalance?.toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Total Contribution</Label>
                <p className="text-xl font-semibold">₹{result.totalContribution?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Interest</Label>
                <p className="text-xl font-semibold">₹{result.totalInterest?.toLocaleString('en-IN')}</p>
              </div>
            </div>
            {result.yearlyProjection && result.yearlyProjection.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.yearlyProjection.slice(-10)}>
                  <defs>
                    <linearGradient id="pfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
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
                  <Bar 
                    dataKey="closingBalance" 
                    fill="url(#pfGradient)"
                    animationDuration={1000}
                    animationEasing="ease-out"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TaxCalculator() {
  const [formData, setFormData] = useState({ annualIncome: '', regime: 'new', deductions: {} })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!formData.annualIncome || parseFloat(formData.annualIncome) <= 0) {
      return 'Annual income must be greater than 0'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await calcAPI.tax({
        annualIncome: parseFloat(formData.annualIncome),
        regime: formData.regime,
        deductions: formData.deductions || {}
      })
      if (response.data.success) setResult(response.data.data)
    } catch (error) {
      console.error('Tax calculation failed:', error)
      alert('Failed to calculate tax. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card glass>
        <CardHeader>
          <CardTitle>Income Tax Calculator</CardTitle>
          <CardDescription>Calculate tax for old or new regime</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income (₹)</Label>
              <Input id="annualIncome" type="number" value={formData.annualIncome} onChange={(e) => setFormData({...formData, annualIncome: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regime">Tax Regime</Label>
              <select id="regime" value={formData.regime} onChange={(e) => setFormData({...formData, regime: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">Calculate</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card glass className="animate-scale-in">
          <CardHeader>
            <CardTitle>Tax Calculation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Taxable Income</Label>
              <p className="text-2xl font-bold">₹{result.taxableIncome?.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Total Tax</Label>
              <p className="text-3xl font-bold text-destructive">₹{result.taxBreakdown?.totalTax?.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Net Income</Label>
              <p className="text-2xl font-bold text-green-600">₹{result.netIncome?.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
              <p className="text-xl font-semibold">{result.effectiveTaxRate}%</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EMICalculator() {
  const [formData, setFormData] = useState({ principal: '', rate: '8.5', tenure: '20' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!formData.principal || parseFloat(formData.principal) <= 0) {
      return 'Loan amount must be greater than 0'
    }
    if (!formData.rate || parseFloat(formData.rate) < 0 || parseFloat(formData.rate) > 50) {
      return 'Interest rate must be between 0 and 50%'
    }
    if (!formData.tenure || parseInt(formData.tenure) <= 0 || parseInt(formData.tenure) > 50) {
      return 'Tenure must be between 1 and 50 years'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await calcAPI.emi({
        principal: parseFloat(formData.principal),
        rate: parseFloat(formData.rate),
        tenure: parseInt(formData.tenure)
      })
      if (response.data.success) setResult(response.data.data)
    } catch (error) {
      console.error('EMI calculation failed:', error)
      alert('Failed to calculate EMI. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            EMI Calculator
          </CardTitle>
          <CardDescription>Calculate loan EMI and amortization</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Loan Amount (₹)</Label>
              <Input id="principal" type="number" value={formData.principal} onChange={(e) => setFormData({...formData, principal: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input id="rate" type="number" step="0.1" value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (Years)</Label>
                <Input id="tenure" type="number" value={formData.tenure} onChange={(e) => setFormData({...formData, tenure: e.target.value})} required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">Calculate</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card glass className="animate-scale-in">
          <CardHeader>
            <CardTitle>EMI Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Monthly EMI</Label>
              <p className="text-3xl font-bold">₹{result.emi?.toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Total Amount</Label>
                <p className="text-xl font-semibold">₹{result.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Interest</Label>
                <p className="text-xl font-semibold">₹{result.totalInterest?.toLocaleString('en-IN')}</p>
              </div>
            </div>
            {result.principalInterestRatio && (
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Principal', value: result.principalInterestRatio.principal },
                      { name: 'Interest', value: result.principalInterestRatio.interest }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    animationDuration={200}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SIPCalculator() {
  const [formData, setFormData] = useState({ monthlyAmount: '', rate: '12', duration: '5' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!formData.monthlyAmount || parseFloat(formData.monthlyAmount) <= 0) {
      return 'Monthly amount must be greater than 0'
    }
    if (!formData.rate || parseFloat(formData.rate) < 0 || parseFloat(formData.rate) > 50) {
      return 'Expected return rate must be between 0 and 50%'
    }
    if (!formData.duration || parseInt(formData.duration) <= 0 || parseInt(formData.duration) > 60) {
      return 'Duration must be between 1 and 60 years'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await calcAPI.sip({
        monthlyAmount: parseFloat(formData.monthlyAmount),
        rate: parseFloat(formData.rate),
        duration: parseInt(formData.duration)
      })
      if (response.data.success) setResult(response.data.data)
    } catch (error) {
      console.error('SIP calculation failed:', error)
      alert('Failed to calculate SIP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SIP Calculator
          </CardTitle>
          <CardDescription>Calculate SIP returns and future value</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyAmount">Monthly Investment (₹)</Label>
              <Input id="monthlyAmount" type="number" value={formData.monthlyAmount} onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Expected Return (%)</Label>
                <Input id="rate" type="number" step="0.1" value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Years)</Label>
                <Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">Calculate</Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card glass className="animate-scale-in">
          <CardHeader>
            <CardTitle>SIP Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Maturity Value</Label>
              <p className="text-3xl font-bold">₹{result.futureValue?.toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Total Investment</Label>
                <p className="text-xl font-semibold">₹{result.totalInvestment?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Estimated Returns</Label>
                <p className="text-xl font-semibold text-green-600">₹{result.estimatedReturns?.toLocaleString('en-IN')}</p>
              </div>
            </div>
            {result.yearlySummary && result.yearlySummary.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.yearlySummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
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
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}


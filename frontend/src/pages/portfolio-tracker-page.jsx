import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { TrendingUp, TrendingDown, Plus, Trash2, Edit2, PieChart, DollarSign, Target } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function PortfolioTrackerPage() {
  const [investments, setInvestments] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('finconnect-portfolio')
        return saved ? JSON.parse(saved) : []
      }
      return []
    } catch (error) {
      console.error('Error loading portfolio:', error)
      return []
    }
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock',
    symbol: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    buyDate: ''
  })

  useEffect(() => {
    localStorage.setItem('finconnect-portfolio', JSON.stringify(investments))
  }, [investments])

  const handleAdd = () => {
    if (editingIndex !== null) {
      // Update existing
      const updated = [...investments]
      updated[editingIndex] = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        currentPrice: parseFloat(formData.currentPrice || formData.buyPrice)
      }
      setInvestments(updated)
      setEditingIndex(null)
    } else {
      // Add new
      setInvestments([...investments, {
        ...formData,
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        currentPrice: parseFloat(formData.currentPrice || formData.buyPrice),
        id: Date.now()
      }])
    }
    setIsDialogOpen(false)
    setFormData({
      name: '',
      type: 'stock',
      symbol: '',
      quantity: '',
      buyPrice: '',
      currentPrice: '',
      buyDate: ''
    })
  }

  const handleEdit = (index) => {
    const investment = investments[index]
    setFormData({
      name: investment.name,
      type: investment.type,
      symbol: investment.symbol || '',
      quantity: investment.quantity.toString(),
      buyPrice: investment.buyPrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      buyDate: investment.buyDate || ''
    })
    setEditingIndex(index)
    setIsDialogOpen(true)
  }

  const handleDelete = (index) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      setInvestments(investments.filter((_, i) => i !== index))
    }
  }

  const calculateStats = () => {
    if (investments.length === 0) {
      return {
        totalInvested: 0,
        currentValue: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        byType: {}
      }
    }

    let totalInvested = 0
    let currentValue = 0
    const byType = {}

    investments.forEach(inv => {
      const invested = inv.quantity * inv.buyPrice
      const current = inv.quantity * inv.currentPrice
      
      totalInvested += invested
      currentValue += current

      if (!byType[inv.type]) {
        byType[inv.type] = { invested: 0, current: 0 }
      }
      byType[inv.type].invested += invested
      byType[inv.type].current += current
    })

    const totalReturn = currentValue - totalInvested
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

    return {
      totalInvested,
      currentValue,
      totalReturn,
      totalReturnPercent,
      byType
    }
  }

  const stats = calculateStats()

  const pieData = Object.entries(stats.byType).map(([type, data]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: data.current
  }))

  const barData = investments.map(inv => ({
    name: inv.symbol || inv.name.substring(0, 6),
    invested: inv.quantity * inv.buyPrice,
    current: inv.quantity * inv.currentPrice,
    return: (inv.quantity * inv.currentPrice) - (inv.quantity * inv.buyPrice)
  }))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio Tracker</h1>
        <p className="text-muted-foreground">
          Track your investments and monitor portfolio performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              {stats.totalReturn >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{stats.totalReturn.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <p className={`text-xs mt-1 ${stats.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalReturnPercent >= 0 ? '+' : ''}{stats.totalReturnPercent.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active investments</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      {investments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card glass>
            <CardHeader>
              <CardTitle>Portfolio Distribution</CardTitle>
              <CardDescription>By investment type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
              <CardDescription>Invested vs Current Value</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Bar dataKey="invested" fill="#3b82f6" name="Invested" />
                  <Bar dataKey="current" fill="#10b981" name="Current" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Investment Button */}
      <div className="flex justify-end">
        <Button onClick={() => {
          setEditingIndex(null)
          setFormData({
            name: '',
            type: 'stock',
            symbol: '',
            quantity: '',
            buyPrice: '',
            currentPrice: '',
            buyDate: ''
          })
          setIsDialogOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? 'Edit Investment' : 'Add Investment'}</DialogTitle>
              <DialogDescription>
                Track your investments to monitor portfolio performance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Investment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Reliance Industries"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="stock">Stock</option>
                  <option value="mutual-fund">Mutual Fund</option>
                  <option value="fd">Fixed Deposit</option>
                  <option value="etf">ETF</option>
                  <option value="bond">Bond</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol/Ticker (Optional)</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., RELIANCE"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="10"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyPrice">Buy Price (₹)</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    placeholder="2500"
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price (₹) - Optional</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  placeholder="Auto-fills with buy price"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyDate">Buy Date (Optional)</Label>
                <Input
                  id="buyDate"
                  type="date"
                  value={formData.buyDate}
                  onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
                />
              </div>
              <Button
                onClick={handleAdd}
                className="w-full"
                disabled={!formData.name || !formData.quantity || !formData.buyPrice}
              >
                {editingIndex !== null ? 'Update Investment' : 'Add Investment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Investments Table */}
      {investments.length === 0 ? (
        <Card glass>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking your portfolio by adding your first investment
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Investment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card glass>
          <CardHeader>
            <CardTitle>Your Investments</CardTitle>
            <CardDescription>Manage and track your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Buy Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Invested</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Return</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((inv, index) => {
                    const invested = inv.quantity * inv.buyPrice
                    const current = inv.quantity * inv.currentPrice
                    const returnAmt = current - invested
                    const returnPercent = invested > 0 ? (returnAmt / invested) * 100 : 0

                    return (
                      <TableRow key={inv.id || index}>
                        <TableCell className="font-medium">{inv.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{inv.type}</Badge>
                        </TableCell>
                        <TableCell>{inv.symbol || '-'}</TableCell>
                        <TableCell>{inv.quantity}</TableCell>
                        <TableCell>₹{inv.buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                        <TableCell>₹{inv.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                        <TableCell>₹{invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>₹{current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${returnAmt >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {returnAmt >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>₹{returnAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            <span className="text-xs">({returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(index)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


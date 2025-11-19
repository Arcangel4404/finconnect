import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Lightbulb, TrendingUp, Shield, PiggyBank, CreditCard } from 'lucide-react'
import { recommendationsAPI } from '../api'

export function RecommendationsPage() {
  const [formData, setFormData] = useState({
    age: '',
    annualIncome: '',
    monthlyExpenses: '',
    riskTolerance: 'moderate',
    savingsPercentage: '20',
    dependents: '0',
    hasEmergencyFund: false,
    hasLifeInsurance: false,
    hasHealthInsurance: false,
    goals: []
  })
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      return 'Please enter a valid age (1-120)'
    }
    if (!formData.annualIncome || parseFloat(formData.annualIncome) <= 0) {
      return 'Annual income must be greater than 0'
    }
    if (!formData.monthlyExpenses || parseFloat(formData.monthlyExpenses) <= 0) {
      return 'Monthly expenses must be greater than 0'
    }
    if (parseFloat(formData.monthlyExpenses) * 12 > parseFloat(formData.annualIncome)) {
      return 'Monthly expenses cannot exceed annual income'
    }
    if (formData.savingsPercentage && (parseFloat(formData.savingsPercentage) < 0 || parseFloat(formData.savingsPercentage) > 100)) {
      return 'Savings percentage must be between 0 and 100'
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
    setRecommendations(null)

    try {
      const userProfile = {
        age: parseInt(formData.age),
        annualIncome: parseFloat(formData.annualIncome),
        monthlyExpenses: parseFloat(formData.monthlyExpenses),
        riskTolerance: formData.riskTolerance,
        savingsPercentage: parseFloat(formData.savingsPercentage) || 20,
        dependents: parseInt(formData.dependents) || 0,
        hasEmergencyFund: formData.hasEmergencyFund,
        hasLifeInsurance: formData.hasLifeInsurance,
        hasHealthInsurance: formData.hasHealthInsurance,
        goals: formData.goals || [],
        existingInvestments: {}
      }

      const response = await recommendationsAPI.get({ userProfile })

      if (response.data.success) {
        setRecommendations(response.data.data)
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      alert('Failed to get recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'sip':
      case 'investment':
        return <TrendingUp className="h-5 w-5" />
      case 'insurance':
        return <Shield className="h-5 w-5" />
      case 'emergency_fund':
      case 'savings':
        return <PiggyBank className="h-5 w-5" />
      case 'tax_saving':
        return <CreditCard className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-950'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-950'
      default:
        return 'border-border bg-card'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lightbulb className="h-8 w-8" />
          Personalized Recommendations
        </h1>
        <p className="text-muted-foreground">
          Get personalized financial recommendations based on your profile
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
            <Card glass>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Fill in your details to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                  <Input id="annualIncome" name="annualIncome" type="number" value={formData.annualIncome} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
                  <Input id="monthlyExpenses" name="monthlyExpenses" type="number" value={formData.monthlyExpenses} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependents">Dependents</Label>
                  <Input id="dependents" name="dependents" type="number" value={formData.dependents} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <select
                  id="riskTolerance"
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="savingsPercentage">Current Savings %</Label>
                <Input id="savingsPercentage" name="savingsPercentage" type="number" step="0.1" value={formData.savingsPercentage} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasEmergencyFund"
                    name="hasEmergencyFund"
                    checked={formData.hasEmergencyFund}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="hasEmergencyFund">I have an emergency fund</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasLifeInsurance"
                    name="hasLifeInsurance"
                    checked={formData.hasLifeInsurance}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="hasLifeInsurance">I have life insurance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasHealthInsurance"
                    name="hasHealthInsurance"
                    checked={formData.hasHealthInsurance}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="hasHealthInsurance">I have health insurance</Label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Get Recommendations'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {recommendations && (
          <div className="space-y-4 animate-scale-in">
            <Card glass>
              <CardHeader>
                <CardTitle>Recommendations Summary</CardTitle>
                <CardDescription>
                  {recommendations.summary?.totalRecommendations} recommendations found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{recommendations.summary?.highPriority || 0}</p>
                    <p className="text-xs text-muted-foreground">High Priority</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{recommendations.summary?.mediumPriority || 0}</p>
                    <p className="text-xs text-muted-foreground">Medium</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{recommendations.summary?.lowPriority || 0}</p>
                    <p className="text-xs text-muted-foreground">Low</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {recommendations.recommendations?.map((rec, index) => (
                <Card 
                  key={index} 
                  glass
                  className={`border-2 ${getPriorityColor(rec.priority)} animate-scale-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getIcon(rec.type)}
                      {rec.category}
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'default'}
                        className="ml-auto"
                      >
                        {rec.priority}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{rec.recommendation}</p>
                    {rec.suggestedAmount && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Suggested Amount</p>
                        <p className="text-xl font-bold">₹{rec.suggestedAmount?.toLocaleString('en-IN')}</p>
                        {rec.suggestedMonthlyContribution && (
                          <p className="text-sm text-muted-foreground">Monthly: ₹{rec.suggestedMonthlyContribution?.toLocaleString('en-IN')}</p>
                        )}
                      </div>
                    )}
                    {rec.suggestedCoverage && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Suggested Coverage</p>
                        <p className="text-xl font-bold">₹{rec.suggestedCoverage?.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                    {rec.expectedReturns && (
                      <p className="text-sm font-medium text-green-600">Expected Returns: {rec.expectedReturns}</p>
                    )}
                    {rec.reason && (
                      <p className="text-xs text-muted-foreground italic">{rec.reason}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { fraudAPI } from '../api'

export function FraudDetectionPage() {
  const [transactionJson, setTransactionJson] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const exampleJson = `{
  "transactionId": "TXN123456789",
  "amount": 75000,
  "type": "debit",
  "timestamp": "2024-11-19T14:30:00Z",
  "location": "Mumbai",
  "merchantCategory": "electronics",
  "hasPAN": false
}`

  const handleAnalyze = async () => {
    if (!transactionJson || transactionJson.trim() === '') {
      setError('Please enter transaction data in JSON format')
      return
    }

    try {
      const transactionData = JSON.parse(transactionJson)
      
      // Validate required fields
      if (!transactionData.amount || transactionData.amount <= 0) {
        setError('Transaction amount is required and must be positive')
        return
      }
      if (!transactionData.timestamp) {
        setError('Transaction timestamp is required')
        return
      }

      const userProfile = {
        annualIncome: transactionData.userIncome || 800000,
        primaryLocation: transactionData.userLocation || "Delhi"
      }
      const transactionHistory = transactionData.history || []

      setLoading(true)
      setError(null)
      setResult(null)

      const response = await fraudAPI.analyze({
        transactionData,
        userProfile,
        transactionHistory
      })

      if (response.data.success) {
        setResult(response.data.data)
      } else {
        setError('Failed to analyze transaction')
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your input syntax.')
      } else {
        setError(err.response?.data?.error || 'Failed to analyze transaction. Please try again.')
      }
      console.error('Analysis failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Fraud Detection
        </h1>
        <p className="text-muted-foreground">
          Analyze transactions for potential fraud patterns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card glass>
          <CardHeader>
            <CardTitle>Transaction Data</CardTitle>
            <CardDescription>
              Enter transaction data in JSON format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionJson">JSON Input</Label>
              <Textarea
                id="transactionJson"
                placeholder={exampleJson}
                value={transactionJson}
                onChange={(e) => setTransactionJson(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
              />
            </div>
            <Button 
              onClick={() => setTransactionJson(exampleJson)}
              variant="outline"
              className="w-full"
            >
              Load Example
            </Button>
            <Button 
              onClick={handleAnalyze}
              disabled={loading || !transactionJson}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Analyze Transaction'}
            </Button>
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card glass className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.isFraudulent ? (
                  <XCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                )}
                Analysis Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">Risk Level</Label>
                  <Badge variant={result.riskLevel === 'High' ? 'destructive' : result.riskLevel === 'Medium' ? 'secondary' : 'default'}>
                    {result.riskLevel}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{result.riskScore}/100</p>
                <p className="text-sm mt-1">Confidence: {result.confidence?.toFixed(1)}%</p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Action Required
                </Label>
                <p className="text-lg font-semibold">{result.action}</p>
              </div>

              {result.riskFactors && result.riskFactors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Risk Factors</Label>
                  <div className="space-y-2">
                    {result.riskFactors.map((factor, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border animate-fade-in">
                        <p className="font-medium text-sm">{factor.rule || factor}</p>
                        {typeof factor === 'object' && factor.description && (
                          <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                        )}
                        {typeof factor === 'object' && factor.severity && (
                          <Badge variant={factor.severity === 'high' ? 'destructive' : factor.severity === 'medium' ? 'secondary' : 'default'} className="mt-2">
                            {factor.severity}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Recommendations</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


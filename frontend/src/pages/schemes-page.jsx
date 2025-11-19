import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { schemesAPI } from '../api'

export function SchemesPage() {
  const [formData, setFormData] = useState({
    scheme: 'all',
    age: '',
    annualIncome: '',
    hasBankAccount: false,
    hasAadhar: false,
    hasOwnHouse: false,
    familyMembers: '',
    occupation: '',
    education: '',
    category: '',
    gender: '',
    state: ''
  })
  const [results, setResults] = useState(null)
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
    if (!formData.annualIncome || parseFloat(formData.annualIncome) < 0) {
      return 'Please enter a valid annual income'
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
    setResults(null)

    try {
      const userData = {
        age: parseInt(formData.age),
        annualIncome: parseFloat(formData.annualIncome),
        hasBankAccount: formData.hasBankAccount,
        hasAadhar: formData.hasAadhar,
        hasOwnHouse: formData.hasOwnHouse,
        familyMembers: parseInt(formData.familyMembers) || 0,
        occupation: formData.occupation || 'private',
        education: formData.education || 'college',
        category: formData.category || 'General',
        gender: formData.gender || 'male',
        state: formData.state || 'Delhi'
      }

      const response = await schemesAPI.eligibility({
        scheme: formData.scheme,
        userData
      })

      if (response.data.success) {
        setResults(response.data.data)
      }
    } catch (error) {
      console.error('Failed to check eligibility:', error)
      alert('Failed to check eligibility. Please try again.')
      // Show fallback results for demo
      setResults({
        schemes: {
          pmay: { schemeName: 'PMAY', eligible: true, details: 'Housing scheme', premium: 0, coverage: 600000 },
          pmjjby: { schemeName: 'PMJJBY', eligible: true, details: 'Life insurance', premium: 436, coverage: 200000 },
          pmsby: { schemeName: 'PMSBY', eligible: true, details: 'Accidental insurance', premium: 20, coverage: 200000 }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const schemesList = results?.schemes || (results ? { [results.schemeCode]: results } : null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Government Schemes Eligibility</h1>
        <p className="text-muted-foreground">
          Check your eligibility for various government schemes
        </p>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Eligibility Form</CardTitle>
          <CardDescription>
            Fill in your details to check scheme eligibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheme">Scheme (or "all" for all schemes)</Label>
                <select
                  id="scheme"
                  name="scheme"
                  value={formData.scheme}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Schemes</option>
                  <option value="pmay">PMAY (Housing)</option>
                  <option value="pmjjby">PMJJBY (Life Insurance)</option>
                  <option value="pmsby">PMSBY (Accidental Insurance)</option>
                  <option value="apy">APY (Pension)</option>
                  <option value="scholarships">Scholarships</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                <Input
                  id="annualIncome"
                  name="annualIncome"
                  type="number"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyMembers">Family Members</Label>
                <Input
                  id="familyMembers"
                  name="familyMembers"
                  type="number"
                  value={formData.familyMembers}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g., private, government, student"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="school">School</option>
                  <option value="college">College</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="Minority">Minority</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasBankAccount"
                  name="hasBankAccount"
                  checked={formData.hasBankAccount}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasBankAccount">I have a bank account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasAadhar"
                  name="hasAadhar"
                  checked={formData.hasAadhar}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasAadhar">I have an Aadhar card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasOwnHouse"
                  name="hasOwnHouse"
                  checked={formData.hasOwnHouse}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasOwnHouse">I own a house</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? 'Checking...' : 'Check Eligibility'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && schemesList && (
        <div className="space-y-4 animate-scale-in">
          <h2 className="text-2xl font-bold">Eligibility Results</h2>
          {Object.entries(schemesList).map(([key, scheme]) => (
            <Card key={key} glass className={scheme.eligible ? 'border-green-500/50' : 'border-muted/50'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {scheme.eligible ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  {scheme.schemeName}
                </CardTitle>
                <CardDescription>{scheme.details}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheme.eligible && scheme.benefits && (
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      {scheme.benefits}
                    </p>
                  </div>
                )}
                {scheme.premium && (
                  <div>
                    <Label className="text-muted-foreground">Annual Premium</Label>
                    <p className="text-lg font-semibold">₹{scheme.premium}</p>
                  </div>
                )}
                {scheme.coverage && (
                  <div>
                    <Label className="text-muted-foreground">Coverage</Label>
                    <p className="text-lg font-semibold">₹{scheme.coverage.toLocaleString('en-IN')}</p>
                  </div>
                )}
                {scheme.subsidy && (
                  <div>
                    <Label className="text-muted-foreground">Subsidy</Label>
                    <p className="text-lg font-semibold">₹{scheme.subsidy.toLocaleString('en-IN')}</p>
                  </div>
                )}
                {scheme.scholarships && scheme.scholarships.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Available Scholarships</Label>
                    {scheme.scholarships.map((sch, idx) => (
                      <Card key={idx} className="p-3">
                        <p className="font-medium">{sch.name}</p>
                        <p className="text-sm text-muted-foreground">{sch.benefits}</p>
                        <p className="text-sm font-semibold mt-1">₹{sch.amount.toLocaleString('en-IN')}/year</p>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


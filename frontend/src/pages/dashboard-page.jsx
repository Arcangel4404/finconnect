import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { 
  Calculator, 
  Building2, 
  FileText, 
  TrendingUp, 
  Shield, 
  Lightbulb,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Newspaper,
  Sparkles,
  Zap,
  Target,
  Users
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: Calculator,
    title: 'Financial Calculators',
    description: 'Calculate PF, Income Tax, EMI, and SIP with precision. Compare old vs new tax regimes.',
    color: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/20',
    link: '/calculators'
  },
  {
    icon: Building2,
    title: 'Bank Lookup',
    description: 'Instantly find bank branch details using IFSC or MICR codes. Access comprehensive banking information.',
    color: 'from-green-500/20 to-green-600/10',
    borderColor: 'border-green-500/20',
    link: '/bank-lookup'
  },
  {
    icon: FileText,
    title: 'Government Schemes',
    description: 'Check eligibility for PMAY, PMJJBY, PMSBY, APY, and scholarship schemes. Get personalized recommendations.',
    color: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/20',
    link: '/schemes'
  },
  {
    icon: PieChart,
    title: 'Portfolio Tracker',
    description: 'Monitor your investments across stocks, mutual funds, FDs, and more. Track returns in real-time.',
    color: 'from-pink-500/20 to-pink-600/10',
    borderColor: 'border-pink-500/20',
    link: '/portfolio'
  },
  {
    icon: Shield,
    title: 'Fraud Detection',
    description: 'Advanced AI-powered fraud detection system. Analyze transactions for suspicious patterns.',
    color: 'from-red-500/20 to-red-600/10',
    borderColor: 'border-red-500/20',
    link: '/fraud-detection'
  },
  {
    icon: Lightbulb,
    title: 'Smart Recommendations',
    description: 'Get personalized investment recommendations based on your age, risk profile, and financial goals.',
    color: 'from-yellow-500/20 to-yellow-600/10',
    borderColor: 'border-yellow-500/20',
    link: '/recommendations'
  },
  {
    icon: Target,
    title: 'Goal Planning',
    description: 'Plan and achieve your financial goals with data-driven insights and structured recommendations.',
    color: 'from-cyan-500/20 to-cyan-600/10',
    borderColor: 'border-cyan-500/20',
    link: '/recommendations'
  }
]

const newsItems = [
  {
    id: 1,
    title: 'New Income Tax Regime Changes Effective from FY 2025',
    description: 'Understanding the latest tax regime updates and how they impact your savings. Compare old vs new regime benefits.',
    category: 'Tax',
    date: '2 hours ago',
    image: '📊',
    url: 'https://www.livemint.com/money/personal-finance'
  },
  {
    id: 2,
    title: 'RBI Introduces New Rules for Fixed Deposits',
    description: 'Learn about the latest FD interest rates and how to maximize your returns with our FD calculator.',
    category: 'Banking',
    date: '5 hours ago',
    image: '🏦',
    url: 'https://economictimes.indiatimes.com/wealth/banking'
  },
  {
    id: 3,
    title: 'Top 5 Mutual Funds to Consider in 2025',
    description: 'Expert recommendations on the best mutual fund schemes based on risk profile and investment goals.',
    category: 'Investments',
    date: '1 day ago',
    image: '📈',
    url: 'https://www.moneycontrol.com/mutual-funds'
  },
  {
    id: 4,
    title: 'Government Launches New Scholarship Schemes',
    description: 'Check your eligibility for the latest government scholarship programs using our eligibility checker.',
    category: 'Schemes',
    date: '2 days ago',
    image: '🎓',
    url: 'https://www.business-standard.com/finance'
  },
  {
    id: 5,
    title: 'How to Protect Yourself from Financial Fraud',
    description: 'Essential tips and tools to identify and prevent financial fraud. Use our fraud detection system.',
    category: 'Security',
    date: '3 days ago',
    image: '🔒',
    url: 'https://www.financialexpress.com/money'
  },
  {
    id: 6,
    title: 'SIP vs Lump Sum: Which is Better?',
    description: 'Compare SIP and lump sum investments to make informed decisions about your investment strategy.',
    category: 'Investments',
    date: '4 days ago',
    image: '💰',
    url: 'https://www.zeebiz.com/personal-finance'
  }
]

const benefits = [
  'Real-time financial calculations',
  'Government scheme eligibility checks',
  'Comprehensive bank lookup',
  'Portfolio tracking and analysis',
  'Fraud detection and security',
  'Personalized recommendations'
]

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-12 border border-primary/20 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <Badge variant="secondary" className="text-sm">Your Financial Companion</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Take Control of Your Financial Future
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Empowering you with powerful financial tools, calculators, and insights to make informed decisions. 
              From tax planning to portfolio management, we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate('/calculators')}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate('/recommendations')}
              >
                Explore Features <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl transform rotate-6" />
              <div className="relative bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl p-8 border border-primary/30 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">12.5%</div>
                    <div className="text-sm text-muted-foreground">Avg Returns</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <Calculator className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">8+</div>
                    <div className="text-sm text-muted-foreground">Tools</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-sm text-muted-foreground">Users</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-muted-foreground">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card glass className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Why Choose FinConnect?
            </CardTitle>
            <CardDescription className="text-base">
              Everything you need to manage your finances in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Features Grid */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">
            Explore our comprehensive suite of financial tools and services
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              >
                <Card 
                  glass 
                  className={`hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border ${feature.borderColor} group h-full`}
                  onClick={() => navigate(feature.link)}
                >
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(feature.link)
                      }}
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card glass className="text-center border-primary/20">
          <CardHeader>
            <Users className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle className="text-4xl font-bold">10K+</CardTitle>
            <CardDescription>Active Users</CardDescription>
          </CardHeader>
        </Card>
        <Card glass className="text-center border-primary/20">
          <CardHeader>
            <Calculator className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle className="text-4xl font-bold">50K+</CardTitle>
            <CardDescription>Calculations Performed</CardDescription>
          </CardHeader>
        </Card>
        <Card glass className="text-center border-primary/20">
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary mx-auto mb-2" />
            <CardTitle className="text-4xl font-bold">95%</CardTitle>
            <CardDescription>User Satisfaction</CardDescription>
          </CardHeader>
        </Card>
      </motion.section>

      {/* News Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-primary" />
                Financial News & Updates
              </h2>
              <p className="text-muted-foreground text-lg">
                Stay informed with the latest financial news and insights
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            >
              <Card 
                glass 
                className="hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border-border/50 h-full group overflow-hidden"
                onClick={() => window.open(news.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl">{news.image}</div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">
                      {news.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {news.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{news.date}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-12 border border-primary/20 shadow-2xl"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ready to Transform Your Financial Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are taking control of their finances with FinConnect
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/calculators')}
            >
              Start Calculating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => navigate('/portfolio')}
            >
              Track Portfolio <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

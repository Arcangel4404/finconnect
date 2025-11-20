import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calculator, 
  Building2, 
  FileText, 
  TrendingUp, 
  Shield, 
  Lightbulb,
  Menu,
  X,
  PieChart
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calculators', label: 'Calculators', icon: Calculator },
  { path: '/bank-lookup', label: 'Bank Lookup', icon: Building2 },
  { path: '/schemes', label: 'Government Schemes', icon: FileText },
  { path: '/mutual-funds', label: 'Mutual Funds', icon: TrendingUp },
  { path: '/portfolio', label: 'Portfolio Tracker', icon: PieChart },
  { path: '/fraud-detection', label: 'Fraud Detection', icon: Shield },
  { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
]

export function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">FinConnect</span>
              </div>
              <p className="hidden lg:block text-xs text-muted-foreground">
                © 2025 FinConnect
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )
                    }
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      "group-hover:scale-110"
                    )} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )
                      }
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        "group-hover:scale-110"
                      )} />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  )
                })}
                {/* Mobile copyright */}
                <div className="px-4 pt-4 border-t border-border mt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    © 2025 FinConnect
                  </p>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}


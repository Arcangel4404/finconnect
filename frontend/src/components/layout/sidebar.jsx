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
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calculators', label: 'Calculators', icon: Calculator },
  { path: '/bank-lookup', label: 'Bank Lookup', icon: Building2 },
  { path: '/schemes', label: 'Government Schemes', icon: FileText },
  { path: '/mutual-funds', label: 'Mutual Funds', icon: TrendingUp },
  { path: '/market', label: 'Market Data', icon: TrendingUp },
  { path: '/fraud-detection', label: 'Fraud Detection', icon: Shield },
  { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
]

export function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FinConnect</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
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
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 FinConnect
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}


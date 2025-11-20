import { TopNavigation } from './sidebar'

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}


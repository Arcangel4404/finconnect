import { Search, Bell, User, Menu } from 'lucide-react'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { DarkModeToggle } from '../ui/dark-mode-toggle'
import { cn } from '../../lib/utils'

export function Navbar({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section - Mobile menu and search */}
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-background/50 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        {/* Right section - Notifications, dark mode, and profile */}
        <div className="flex items-center space-x-2">
          <DarkModeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full animate-pulse" />
          </Button>

          <div className="flex items-center space-x-2 ml-2">
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 ring-primary transition-all">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=FinConnect" alt="User" />
              <AvatarFallback>FC</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


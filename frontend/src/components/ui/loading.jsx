import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Loading({ className, size = 'default' }) {
  const sizes = {
    default: 'h-4 w-4',
    sm: 'h-3 w-3',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  return (
    <Loader2 className={cn('animate-spin text-muted-foreground', sizes[size], className)} />
  )
}


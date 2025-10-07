import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-10 w-full rounded-md border border-input bg-white/70 px-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] dark:bg-black/30 dark:border-white/10',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

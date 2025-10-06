import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <Button aria-label="Toggle theme" variant="ghost" size="icon" onClick={toggleTheme} title={isDark ? 'Switch to light' : 'Switch to dark'}>
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

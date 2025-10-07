import React from 'react'
import { Link } from 'wouter'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'

export const Header: React.FC = () => {
  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-black/30">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="font-semibold text-lg">tutlabs</Link>
        <nav className="ml-auto flex items-center gap-2">
          <Link href="/tutors"><Button variant="ghost">Tutors</Button></Link>
          <Link href="/messages"><Button variant="ghost">Messages</Button></Link>
          <Link href="/requirements"><Button variant="ghost">Requirements</Button></Link>
          <Link href="/login"><Button variant="ghost">Login</Button></Link>
          <Link href="/signup"><Button>Sign up</Button></Link>
          <Button variant="ghost" onClick={handleSignOut}>Sign out</Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

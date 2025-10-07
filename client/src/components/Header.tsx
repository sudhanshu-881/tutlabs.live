import React from 'react'
import { Link } from 'wouter'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'

export const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  const NavLinks = () => (
    <>
      <Link href="/tutors"><Button variant="ghost">Tutors</Button></Link>
      <Link href="/requirements"><Button variant="ghost">Requirements</Button></Link>
      <Link href="/messages"><Button variant="ghost">Messages</Button></Link>
      <Link href="/login"><Button variant="ghost">Sign in</Button></Link>
      <Link href="/signup"><Button>Get started</Button></Link>
      <Button variant="ghost" onClick={handleSignOut}>Sign out</Button>
    </>
  )
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur dark:bg-black/30">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-block h-6 w-6 rounded bg-[hsl(var(--primary))]"></span>
          tutlabs
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLinks />
          <ThemeToggle />
        </nav>
        <button
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
      {open && (
        <div className="mx-auto block max-w-6xl border-t px-4 py-3 md:hidden" role="dialog" aria-modal="true">
          <div className="flex flex-col gap-2">
            <NavLinks />
            <div className="mt-1"><ThemeToggle /></div>
          </div>
        </div>
      )}
    </header>
  )
}

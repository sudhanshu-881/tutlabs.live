import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Route, Switch } from 'wouter'
import './index.css'
import { queryClient } from './lib/queryClient'
import { ThemeProvider } from './components/ThemeProvider'
import { Header } from './components/Header'
import { Toaster } from './hooks/use-toast'

function HomePage() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">tutlabs.live</h1>
        <p className="text-muted-foreground">Location-based tutoring platform</p>
      </main>
    </div>
  )
}

function NotFound() {
  return <div className="p-6">Not found</div>
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route component={NotFound} />
      </Switch>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  </QueryClientProvider>
)

createRoot(document.getElementById('root')!).render(<App />)

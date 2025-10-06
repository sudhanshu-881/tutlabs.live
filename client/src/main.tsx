import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Switch } from 'wouter'
import './index.css'

const queryClient = new QueryClient()

function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">tutlabs.live</h1>
      <p className="text-muted-foreground">Location-based tutoring platform</p>
    </div>
  )
}

function NotFound() {
  return <div className="p-6">Not found</div>
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  </QueryClientProvider>
)

createRoot(document.getElementById('root')!).render(<App />)

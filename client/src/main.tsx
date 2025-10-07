import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Route, Switch } from 'wouter'
import './index.css'
import { queryClient } from './lib/queryClient'
import { ThemeProvider } from './components/ThemeProvider'
import { Header } from './components/Header'
import { Toaster } from './hooks/use-toast'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { TutorProfileForm } from './components/TutorProfileForm'
import { TutorCard } from './components/TutorCard'
import { RequirementsPage } from './pages/RequirementsPage'
import { MessagesPage } from './pages/MessagesPage'
import { Hero } from './components/Hero'
import { Hero3D } from './components/Hero3D'

function HomePage() {
  const [subject, setSubject] = React.useState('')
  const [city, setCity] = React.useState('')
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null)
  const [tutors, setTutors] = React.useState<any[]>([])

  const doSearch = async () => {
    let lat = coords?.lat
    let lng = coords?.lng
    if (!lat || !lng) {
      // fallback: attempt geolocation
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat = pos.coords.latitude
            lng = pos.coords.longitude
            setCoords({ lat: lat!, lng: lng! })
            resolve()
          },
          () => resolve(),
          { enableHighAccuracy: true, timeout: 4000 }
        )
      })
    }
    if (!lat || !lng) return
    const params = new URLSearchParams()
    params.set('lat', String(lat))
    params.set('lng', String(lng))
    if (subject) params.set('subject', subject)
    const res = await fetch(`/api/tutors/nearby?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      setTutors(data.tutors || [])
    }
  }

  return (
    <div>
      <Header />
      <Hero />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Hero3D />
        <h2 id="search" className="mt-8 text-2xl font-semibold">Find nearby tutors</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10 w-full rounded-md border px-3" placeholder="Subject (e.g., Math)" />
          <input value={city} onChange={(e) => setCity(e.target.value)} className="h-10 w-full rounded-md border px-3" placeholder="City (optional)" />
          <button onClick={doSearch} className="h-10 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">Search</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((t) => (
            <TutorCard key={t.userId} name={t.name ?? 'Tutor'} subjects={t.subjects ?? []} ratePerHour={t.ratePerHour ?? 0} city={t.city ?? ''} distanceMiles={t.distanceMiles} />
          ))}
        </div>
      </div>
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
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/tutor/me" component={() => (
          <div>
            <Header />
            <main className="mx-auto max-w-3xl px-4 py-6">
              <h1 className="mb-4 text-xl font-semibold">My Tutor Profile</h1>
              <TutorProfileForm />
            </main>
          </div>
        )} />
        <Route path="/requirements" component={RequirementsPage} />
        <Route path="/messages" component={MessagesPage} />
        <Route component={NotFound} />
      </Switch>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  </QueryClientProvider>
)

createRoot(document.getElementById('root')!).render(<App />)

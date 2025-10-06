import React from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/ui/button'
import { Toaster, toast } from '../hooks/use-toast'

export const RequirementsPage: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([])
  const [subject, setSubject] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [city, setCity] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const load = async () => {
    const res = await fetch('/api/requirements')
    if (res.ok) {
      const data = await res.json()
      setItems(data.requirements ?? [])
    }
  }

  React.useEffect(() => { load() }, [])

  const createRequirement = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description, city: city || undefined }),
      })
      if (!res.ok) throw new Error('Failed to post requirement')
      setSubject(''); setDescription(''); setCity('')
      await load()
      toast.success('Requirement posted')
    } catch (e: any) {
      toast.error(e.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Requirements</h1>
        <div className="space-y-3 rounded-lg border p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="h-10 w-full rounded-md border px-3" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <input className="h-10 w-full rounded-md border px-3" placeholder="City (optional)" value={city} onChange={e => setCity(e.target.value)} />
            <Button onClick={createRequirement} disabled={loading || !subject || !description}>{loading ? 'Posting...' : 'Post'}</Button>
          </div>
          <textarea className="min-h-[100px] w-full rounded-md border p-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mt-6 space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.subject}</div>
                <div className="text-sm text-muted-foreground">{r.city}</div>
              </div>
              <p className="mt-2 text-sm">{r.description}</p>
            </div>
          ))}
        </div>
      </main>
      <Toaster />
    </div>
  )
}

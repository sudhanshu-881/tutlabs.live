import React from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/ui/button'

export const MessagesPage: React.FC = () => {
  const [peerId, setPeerId] = React.useState<number | ''>('')
  const [body, setBody] = React.useState('')
  const [messages, setMessages] = React.useState<any[]>([])
  const [polling, setPolling] = React.useState(false)

  const load = async (id: number) => {
    const res = await fetch(`/api/messages?peerId=${id}`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data.messages || [])
    }
  }

  React.useEffect(() => {
    if (typeof peerId === 'number') {
      load(peerId)
      setPolling(true)
      const t = setInterval(() => load(peerId), 4000)
      return () => { clearInterval(t); setPolling(false) }
    }
  }, [peerId])

  const send = async () => {
    if (typeof peerId !== 'number' || !body) return
    const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipientId: peerId, body }) })
    if (res.ok) {
      setBody('')
      await load(peerId)
    }
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Messages</h1>
        <div className="mb-4 flex items-center gap-2">
          <input className="h-10 w-40 rounded-md border px-3" placeholder="Peer userId" value={peerId} onChange={e => setPeerId(e.target.value ? Number(e.target.value) : '')} />
          <span className="text-sm text-muted-foreground">Polling: {polling ? 'On' : 'Off'}</span>
        </div>
        <div className="mb-3 space-y-2 rounded-lg border p-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-md border bg-accent/40 p-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">From: {m.senderId}</div>
                <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-1">{m.body}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="h-10 w-full rounded-md border px-3" placeholder="Type a message" value={body} onChange={e => setBody(e.target.value)} />
          <Button onClick={send}>Send</Button>
        </div>
      </main>
    </div>
  )
}

import { Router } from 'express'
import { z } from 'zod'

export const router = Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'tutlabs.live', timestamp: new Date().toISOString() })
})

router.post('/auth/register', (req, res) => {
  const bodySchema = z.object({ email: z.string().email(), password: z.string().min(8) })
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  res.status(201).json({ id: 'demo-user-id', email: parsed.data.email })
})

router.post('/auth/login', (_req, res) => {
  res.json({ token: 'demo-token' })
})

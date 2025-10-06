import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from '../_db'
import { LoginSchema } from '../../shared/schema'
import { compareSync } from 'bcryptjs'
import { signJwt, serializeAuthCookie } from '../_jwt'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const parse = LoginSchema.safeParse(req.body ?? (typeof req.body === 'string' ? JSON.parse(req.body) : {}))
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })
  const { email, password } = parse.data

  const found = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
  if (found.length === 0) return res.status(401).json({ error: 'Invalid credentials' })

  const user = found[0] as any
  if (!compareSync(password, user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signJwt({ uid: user.id, role: user.role })
  res.setHeader('Set-Cookie', serializeAuthCookie(token))
  return res.status(200).json({ id: user.id, email: user.email, role: user.role, name: user.name })
}

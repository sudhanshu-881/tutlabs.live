import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from '../_db'
import { RegisterSchema } from '../../shared/schema'
import { hashSync } from 'bcryptjs'
import { signJwt, serializeAuthCookie } from '../_jwt'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const parse = RegisterSchema.safeParse(req.body ?? (typeof req.body === 'string' ? JSON.parse(req.body) : {}))
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })
  const { email, password, role, name } = parse.data

  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
  if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' })

  const passwordHash = hashSync(password, 10)
  const [inserted] = await db
    .insert(schema.users)
    .values({ email, passwordHash, role, name })
    .returning({ id: schema.users.id, email: schema.users.email, role: schema.users.role, name: schema.users.name })

  const token = signJwt({ uid: inserted.id, role: inserted.role as 'tutor' | 'parent' })
  res.setHeader('Set-Cookie', serializeAuthCookie(token))
  return res.status(201).json(inserted)
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from '../_db'
import { readTokenFromRequest, verifyJwt } from '../_jwt'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = readTokenFromRequest(req)
  if (!token) return res.status(401).json({ user: null })
  const payload = verifyJwt(token)
  if (!payload) return res.status(401).json({ user: null })

  const userRows = await db
    .select({ id: schema.users.id, email: schema.users.email, role: schema.users.role, name: schema.users.name })
    .from(schema.users)
    .where(eq(schema.users.id, payload.uid))
    .limit(1)

  const user = userRows[0] ?? null
  return res.status(200).json({ user })
}

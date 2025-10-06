import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from '../_db'
import { readTokenFromRequest, verifyJwt } from '../_jwt'
import { TutorProfileUpsertSchema } from '../../shared/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = readTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const userId = Number(req.query.userId ?? payload.uid)
    if (!userId) return res.status(400).json({ error: 'userId required' })
    const rows = await db.select().from(schema.tutorProfiles).where(eq(schema.tutorProfiles.userId, userId)).limit(1)
    return res.status(200).json({ profile: rows[0] ?? null })
  }

  if (req.method === 'POST') {
    const parse = TutorProfileUpsertSchema.safeParse(req.body ?? (typeof req.body === 'string' ? JSON.parse(req.body) : {}))
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })
    const values = parse.data

    const exists = await db.select().from(schema.tutorProfiles).where(eq(schema.tutorProfiles.userId, payload.uid)).limit(1)
    if (exists.length === 0) {
      await db.insert(schema.tutorProfiles).values({ userId: payload.uid, ...values })
    } else {
      await db.update(schema.tutorProfiles).set({ ...values, updatedAt: new Date() }).where(eq(schema.tutorProfiles.userId, payload.uid))
    }

    const [profile] = await db.select().from(schema.tutorProfiles).where(eq(schema.tutorProfiles.userId, payload.uid)).limit(1)
    return res.status(200).json({ profile })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

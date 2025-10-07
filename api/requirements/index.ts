import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initSentryServer } from '../_monitor'
import { db, schema } from '../_db'
import { readTokenFromRequest, verifyJwt } from '../_jwt'
import { RequirementCreateSchema } from '../../shared/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initSentryServer()
  if (req.method === 'GET') {
    const items = await db
      .select({
        id: schema.requirements.id,
        parentUserId: schema.requirements.parentUserId,
        subject: schema.requirements.subject,
        description: schema.requirements.description,
        city: schema.requirements.city,
        createdAt: schema.requirements.createdAt,
      })
      .from(schema.requirements)
      .orderBy(schema.requirements.createdAt)
    return res.status(200).json({ requirements: items })
  }

  if (req.method === 'POST') {
    const token = readTokenFromRequest(req)
    const payload = token && verifyJwt(token)
    if (!payload) return res.status(401).json({ error: 'Unauthorized' })

    const parse = RequirementCreateSchema.safeParse(req.body ?? (typeof req.body === 'string' ? JSON.parse(req.body) : {}))
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

    const [inserted] = await db
      .insert(schema.requirements)
      .values({ parentUserId: payload.uid, ...parse.data })
      .returning({ id: schema.requirements.id })

    return res.status(201).json({ id: inserted.id })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

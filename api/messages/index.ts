import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from '../_db'
import { readTokenFromRequest, verifyJwt } from '../_jwt'
import { MessageCreateSchema } from '../../shared/schema'
import { and, or, eq, desc } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = readTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const peerId = Number(req.query.peerId)
    if (!peerId) return res.status(400).json({ error: 'peerId required' })

    const rows = await db
      .select({
        id: schema.messages.id,
        senderId: schema.messages.senderId,
        recipientId: schema.messages.recipientId,
        body: schema.messages.body,
        createdAt: schema.messages.createdAt,
        readAt: schema.messages.readAt,
      })
      .from(schema.messages)
      .where(
        or(
          and(eq(schema.messages.senderId, payload.uid), eq(schema.messages.recipientId, peerId)),
          and(eq(schema.messages.senderId, peerId), eq(schema.messages.recipientId, payload.uid))
        )
      )
      .orderBy(desc(schema.messages.createdAt))
      .limit(100)

    return res.status(200).json({ messages: rows.reverse() })
  }

  if (req.method === 'POST') {
    const parse = MessageCreateSchema.safeParse(req.body ?? (typeof req.body === 'string' ? JSON.parse(req.body) : {}))
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() })

    const [inserted] = await db
      .insert(schema.messages)
      .values({ senderId: payload.uid, recipientId: parse.data.recipientId, body: parse.data.body })
      .returning({ id: schema.messages.id })

    return res.status(201).json({ id: inserted.id })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

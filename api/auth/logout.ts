import type { VercelRequest, VercelResponse } from '@vercel/node'
import { serializeClearCookie } from '../_jwt'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', serializeClearCookie())
  return res.status(200).json({ ok: true })
}

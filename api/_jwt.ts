import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const COOKIE_NAME = 'auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface JwtPayload {
  uid: number
  role: 'tutor' | 'parent'
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return secret
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { algorithm: 'HS256', expiresIn: COOKIE_MAX_AGE })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload
  } catch {
    return null
  }
}

export function serializeAuthCookie(token: string) {
  return cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

export function serializeClearCookie() {
  return cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function readTokenFromRequest(req: { headers: Record<string, any> }): string | null {
  const raw = req.headers['cookie']
  if (!raw) return null
  const parsed = cookie.parse(Array.isArray(raw) ? raw.join(';') : raw)
  return parsed[COOKIE_NAME] ?? null
}

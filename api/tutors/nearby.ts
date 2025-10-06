import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, schema } from '../_db'
import { and, eq, isNotNull } from 'drizzle-orm'

function toNumber(value: any, fallback: number | null = null): number | null {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8 // miles
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const lat = toNumber(req.query.lat)
  const lng = toNumber(req.query.lng)
  const radius = toNumber(req.query.radius, 10) ?? 10
  const subject = typeof req.query.subject === 'string' ? req.query.subject.trim() : ''
  const maxRate = toNumber(req.query.maxRate)

  if (lat == null || lng == null) {
    return res.status(400).json({ error: 'lat and lng are required' })
  }

  // Fetch candidates with coordinates
  const rows = await db
    .select({
      userId: schema.tutorProfiles.userId,
      bio: schema.tutorProfiles.bio,
      education: schema.tutorProfiles.education,
      experience: schema.tutorProfiles.experience,
      subjects: schema.tutorProfiles.subjects,
      ratePerHour: schema.tutorProfiles.ratePerHour,
      city: schema.tutorProfiles.city,
      latitude: schema.tutorProfiles.latitude,
      longitude: schema.tutorProfiles.longitude,
      name: schema.users.name,
    })
    .from(schema.tutorProfiles)
    .innerJoin(schema.users, eq(schema.users.id, schema.tutorProfiles.userId))
    .where(and(isNotNull(schema.tutorProfiles.latitude), isNotNull(schema.tutorProfiles.longitude)))

  const results = rows
    .map((r) => {
      const lat2 = typeof r.latitude === 'string' ? parseFloat(r.latitude) : (r.latitude as unknown as number)
      const lng2 = typeof r.longitude === 'string' ? parseFloat(r.longitude) : (r.longitude as unknown as number)
      if (!Number.isFinite(lat2) || !Number.isFinite(lng2)) return null
      const distanceMiles = haversineMiles(lat, lng, lat2, lng2)
      return { ...r, distanceMiles }
    })
    .filter(Boolean) as Array<typeof rows[number] & { distanceMiles: number }>
    .filter((r) => (maxRate != null ? (r.ratePerHour ?? Infinity) <= maxRate : true))
    .filter((r) => (subject ? (r.subjects ?? []).some((s) => s.toLowerCase().includes(subject.toLowerCase())) : true))
    .filter((r) => r.distanceMiles <= radius)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, 50)

  return res.status(200).json({ tutors: results })
}

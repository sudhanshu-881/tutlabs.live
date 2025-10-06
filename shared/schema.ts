import { pgTable, serial, varchar, text, timestamp, pgEnum, integer, numeric, boolean } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const userRole = pgEnum('user_role', ['tutor', 'parent'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRole('role').notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const tutorProfiles = pgTable('tutor_profiles', {
  userId: integer('user_id').references(() => users.id).primaryKey(),
  bio: text('bio'),
  education: text('education'),
  experience: text('experience'),
  subjects: text('subjects').array(),
  ratePerHour: integer('rate_per_hour'),
  city: varchar('city', { length: 255 }),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  availableMon: boolean('available_mon').default(false).notNull(),
  availableTue: boolean('available_tue').default(false).notNull(),
  availableWed: boolean('available_wed').default(false).notNull(),
  availableThu: boolean('available_thu').default(false).notNull(),
  availableFri: boolean('available_fri').default(false).notNull(),
  availableSat: boolean('available_sat').default(false).notNull(),
  availableSun: boolean('available_sun').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['tutor', 'parent']),
  name: z.string().min(1).max(255).optional(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const TutorProfileUpsertSchema = z.object({
  bio: z.string().max(5000).optional().nullable(),
  education: z.string().max(5000).optional().nullable(),
  experience: z.string().max(5000).optional().nullable(),
  subjects: z.array(z.string()).default([]),
  ratePerHour: z.number().int().positive().max(10000).optional().nullable(),
  city: z.string().max(255).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  availableMon: z.boolean().optional(),
  availableTue: z.boolean().optional(),
  availableWed: z.boolean().optional(),
  availableThu: z.boolean().optional(),
  availableFri: z.boolean().optional(),
  availableSat: z.boolean().optional(),
  availableSun: z.boolean().optional(),
})

export const TutorProfileOutputSchema = z.object({
  userId: z.number(),
  bio: z.string().nullish(),
  education: z.string().nullish(),
  experience: z.string().nullish(),
  subjects: z.array(z.string()),
  ratePerHour: z.number().nullish(),
  city: z.string().nullish(),
  latitude: z.string().nullish(),
  longitude: z.string().nullish(),
  availableMon: z.boolean(),
  availableTue: z.boolean(),
  availableWed: z.boolean(),
  availableThu: z.boolean(),
  availableFri: z.boolean(),
  availableSat: z.boolean(),
  availableSun: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type TutorProfileUpsert = z.infer<typeof TutorProfileUpsertSchema>
export type TutorProfileOutput = z.infer<typeof TutorProfileOutputSchema>

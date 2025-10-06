import { pgTable, serial, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
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

export const UserOutputSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.enum(['tutor', 'parent']),
  name: z.string().nullish(),
  createdAt: z.date(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type UserOutput = z.infer<typeof UserOutputSchema>

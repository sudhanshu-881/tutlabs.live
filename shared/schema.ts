import { z } from 'zod'

export const userTable = {
  // Placeholder for Drizzle definitions in actual implementation
}

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export type RegisterInput = z.infer<typeof RegisterSchema>

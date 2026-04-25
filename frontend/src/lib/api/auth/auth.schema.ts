import z from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginRequest = z.infer<typeof loginSchema>

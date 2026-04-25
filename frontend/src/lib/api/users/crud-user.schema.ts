import type { User } from '@Lib/api/users/user.schema'
import type { CommonPaginatedRequest } from '@Lib/utils/schemas'
import z from 'zod'

// -------------- Paginated --------------
export interface UsersPaginatedRequest extends CommonPaginatedRequest {
  sortBy?: keyof User | null
}

export interface UsersPaginated {
  totalEntries: number
  entries: User[]
}

// -------------- Create & Update --------------
const validatedPassword = z
  .string()
  .min(6, 'Password should be at least 6 characters long')
  .regex(/[A-Z]/, 'Password should contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password should contain at least one lowercase letter')
  .regex(/\d/, 'Password should contain at least one number')

export const userCreateSchema = z.object({
  email: z.email('Invalid email address'),
  username: z.string().min(6, 'Username should be at least 6 characters long'),
  password: validatedPassword,
})

export type UserCreate = z.infer<typeof userCreateSchema>

export const userUpdateSchema = z.object({
  email: z.email('Invalid email address').optional(),
  username: z.string().min(6, 'Username should be at least 6 characters long').optional(),
  newPassword: validatedPassword.optional(),
  oldPassword: validatedPassword.optional(),
})

export type UserUpdate = z.infer<typeof userUpdateSchema>

import z from 'zod'

export const contactCreateSchema = z.object({
  email: z.email('A valid email is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message must be at most 5000 characters'),
})

export type ContactCreate = z.infer<typeof contactCreateSchema>

export interface ContactRequestResponse {
  id: number
  email: string
  title: string
  message: string
  createdAt: string
  updatedAt: string
}

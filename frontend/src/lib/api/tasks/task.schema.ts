import z from 'zod'

export const taskSchema = z.object({
  id: z.number().int(),
  ownerId: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.string().nullable(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>

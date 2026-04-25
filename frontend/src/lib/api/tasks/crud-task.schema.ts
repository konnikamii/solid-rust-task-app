import type { CommonPaginatedRequest } from '@Lib/utils/schemas'
import { z } from 'zod'
import type { Task } from './task.schema'

export interface TaskFilters {
  search?: string
  completed?: boolean | null
}

export interface TasksPaginatedRequest extends CommonPaginatedRequest {
  sortBy?: 'id' | 'title' | 'createdAt' | null
  filters?: TaskFilters
}

export interface TasksPaginated {
  totalEntries: number
  entries: Task[]
}

export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: z.string().max(5000, 'Description must be at most 5000 characters').nullish(),
  dueDate: z.string().nullish(),
  completed: z.boolean().optional(),
})

export type TaskCreate = z.infer<typeof taskCreateSchema>

export const taskUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: z.string().max(5000, 'Description must be at most 5000 characters').nullable(),
  dueDate: z.string().nullable(),
  completed: z.boolean(),
})

export type TaskUpdate = z.infer<typeof taskUpdateSchema>

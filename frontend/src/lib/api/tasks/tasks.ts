import { queryClient } from '@Lib/api/client'
import type { TaskCreate, TaskUpdate, TasksPaginated, TasksPaginatedRequest } from '@Lib/api/tasks/crud-task.schema'
import type { Task } from '@Lib/api/tasks/task.schema'
import { urls } from '@Lib/api/urls'
import api from '@Lib/utils/fetch'
import { createMutation, createQuery } from '@tanstack/solid-query'

export const getTaskById = async (id: string) => {
  const response = await api.get<Task>(urls.tasks.getTaskById(id))
  return response.data
}

export const useGetTaskById = (id: string) =>
  createQuery(() => ({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id),
  }))

export const getPaginatedTasks = async (body: TasksPaginatedRequest) => {
  const response = await api.post<TasksPaginated>(urls.tasks.getPaginatedTasks, body)
  return response.data
}

export const useGetPaginatedTasks = (body: TasksPaginatedRequest) =>
  createQuery(() => ({
    queryKey: ['tasks', body],
    queryFn: () => getPaginatedTasks(body),
  }))

export const createTask = async (body: TaskCreate) => {
  const payload = {
    title: body.title,
    description: body.description ?? null,
    dueDate: body.dueDate ?? null,
    completed: body.completed ?? false,
  }

  const response = await api.post<Task>(urls.tasks.createTask, payload)
  return response.data
}

export const useCreateTask = () =>
  createMutation(() => ({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  }))

export const updateTask = async (id: string, body: TaskUpdate) => {
  const response = await api.put<Task>(urls.tasks.updateTask(id), {
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
    completed: body.completed,
  })
  return response.data
}

export const useUpdateTask = () =>
  createMutation(() => ({
    mutationFn: ({ id, body }: { id: string; body: TaskUpdate }) => updateTask(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
    },
  }))

export const deleteTask = async (id: string) => {
  const response = await api.delete<number>(urls.tasks.deleteTask(id))
  return response.data
}

export const useDeleteTask = () =>
  createMutation(() => ({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.removeQueries({ queryKey: ['task', id] })
    },
  }))

import { queryClient } from '@Lib/api/client'
import { urls } from '@Lib/api/urls'
import type { UserCreate, UsersPaginated, UsersPaginatedRequest, UserUpdate } from '@Lib/api/users/crud-user.schema'
import type { User } from '@Lib/api/users/user.schema'
import api from '@Lib/utils/fetch'
import { createMutation, createQuery } from '@tanstack/solid-query'

export const getMe = async () => {
  const response = await api.get<User>(urls.users.getMe)
  return response.data
}

export const useGetMe = () =>
  createQuery(() => ({
    queryKey: ['user'],
    queryFn: getMe,
  }))

export const getUserById = async (id: string) => {
  const response = await api.get<User>(urls.users.getUserById(id))
  return response.data
}

export const useGetUserById = (id: string) =>
  createQuery(() => ({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
  }))

export const getPaginatedUsers = async (body: UsersPaginatedRequest) => {
  const response = await api.post<UsersPaginated>(urls.users.getPaginatedUsers, body)
  return response.data
}

export const useGetPaginatedUsers = (body: UsersPaginatedRequest) =>
  createQuery(() => ({
    queryKey: ['users', body],
    queryFn: () => getPaginatedUsers(body),
  }))

export const createUser = async (body: UserCreate) => {
  const formData = new FormData()
  formData.set('username', body.username)
  formData.set('email', body.email)
  formData.set('password', body.password)

  const response = await api.post<User>(urls.users.createUser, formData)
  return response.data
}

export const useCreateUser = () =>
  createMutation(() => ({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  }))

export const updateUser = async (id: string, body: UserUpdate) => {
  const response = await api.put<User>(urls.users.updateUser(id), body)
  return response.data
}

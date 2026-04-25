import type { ContactCreate, ContactRequestResponse } from '@Lib/api/contact/contact.schema'
import { urls } from '@Lib/api/urls'
import api from '@Lib/utils/fetch'
import { createMutation } from '@tanstack/solid-query'

export const createContactRequest = async (body: ContactCreate) => {
  const response = await api.post<ContactRequestResponse>(urls.contact.createContactRequest, body)
  return response.data
}

export const useCreateContactRequest = () =>
  createMutation(() => ({
    mutationFn: createContactRequest,
  }))

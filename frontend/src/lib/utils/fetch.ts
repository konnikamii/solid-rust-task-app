const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

type Primitive = string | number | boolean | null | undefined
type QueryValue = Primitive | Primitive[]
type QueryParams = Record<string, QueryValue>
type UrlInput = string | URL

type ResponseType = 'auto' | 'json' | 'text' | 'blob' | 'formData' | 'arrayBuffer'

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export type ApiRequestConfig = RequestInit & {
  baseURL?: string
  params?: QueryParams
  data?: unknown
  timeout?: number
  responseType?: ResponseType
  fetcher?: typeof fetch
}

export type ApiResponse<T = unknown> = {
  data: T
  status: number
  statusText: string
  headers: Headers
  url: string
  ok: boolean
  raw: Response
}

export class ApiError<T = unknown> extends Error {
  status: number
  statusText: string
  data: T
  headers: Headers
  url: string
  raw: Response

  constructor(message: string, response: ApiResponse<T>) {
    super(message)
    this.name = 'ApiError'
    this.status = response.status
    this.statusText = response.statusText
    this.data = response.data
    this.headers = response.headers
    this.url = response.url
    this.raw = response.raw
  }
}

function isAbsoluteUrl(url: string) {
  return /^[a-z][a-z\d+\-.]*:/i.test(url)
}

function buildUrl(url: UrlInput, params?: QueryParams, baseURL = '') {
  const rawUrl = url.toString()
  const resolvedUrl = isAbsoluteUrl(rawUrl) ? rawUrl : baseURL ? new URL(rawUrl, baseURL).toString() : rawUrl

  if (!params || Object.keys(params).length === 0) return resolvedUrl

  const urlObject = new URL(resolvedUrl, 'http://local')

  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) urlObject.searchParams.append(key, String(item))
      }
      continue
    }

    urlObject.searchParams.set(key, String(value))
  }

  return isAbsoluteUrl(resolvedUrl) ? urlObject.toString() : `${urlObject.pathname}${urlObject.search}${urlObject.hash}`
}

function isJsonBody(value: unknown) {
  return (
    value != null &&
    !(value instanceof FormData) &&
    !(value instanceof URLSearchParams) &&
    !(value instanceof Blob) &&
    !(value instanceof ArrayBuffer) &&
    typeof value !== 'string'
  )
}

async function parseResponseBody<T>(response: Response, responseType: ResponseType = 'auto') {
  if (response.status === 204) return undefined as T

  if (responseType === 'json') return (await response.json()) as T
  if (responseType === 'text') return (await response.text()) as T
  if (responseType === 'blob') return (await response.blob()) as T
  if (responseType === 'formData') return (await response.formData()) as T
  if (responseType === 'arrayBuffer') return (await response.arrayBuffer()) as T

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''

  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  const text = await response.text()

  if (!text) return undefined as T

  try {
    return JSON.parse(text) as T
  } catch {
    return text as T
  }
}

function createRequestMethods(defaultConfig: ApiRequestConfig = {}) {
  const request = async <T = unknown>(url: UrlInput, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> => {
    const mergedConfig = { ...defaultConfig, ...config }
    const fetcher = mergedConfig.fetcher ?? fetch
    const headers = new Headers(defaultConfig.headers)

    if (config.headers) {
      new Headers(config.headers).forEach((value, key) => headers.set(key, value))
    }

    if (!headers.has('accept')) {
      headers.set('accept', 'application/json')
    }

    const payload = mergedConfig.body ?? mergedConfig.data
    let body = payload as BodyInit | null | undefined

    if (isJsonBody(payload)) {
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json')
      }
      body = JSON.stringify(payload)
    }

    const controller = new AbortController()
    const signal = mergedConfig.signal ?? controller.signal
    const timeoutId = mergedConfig.timeout ? setTimeout(() => controller.abort(), mergedConfig.timeout) : undefined

    try {
      const response = await fetcher(buildUrl(url, mergedConfig.params, mergedConfig.baseURL), {
        ...mergedConfig,
        headers,
        body,
        signal,
        credentials: mergedConfig.credentials ?? 'include',
      })

      const data = await parseResponseBody<T>(response, mergedConfig.responseType)
      const result: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        url: response.url,
        ok: response.ok,
        raw: response,
      }

      if (!response.ok) {
        throw new ApiError(`Request failed with status ${response.status}`, result)
      }

      return result
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  return {
    request,
    get: <T = unknown>(url: UrlInput, config?: Omit<ApiRequestConfig, 'method' | 'data'>) =>
      request<T>(url, { ...config, method: Method.GET }),
    delete: <T = unknown>(url: UrlInput, config?: Omit<ApiRequestConfig, 'method' | 'data'>) =>
      request<T>(url, { ...config, method: Method.DELETE }),
    post: <T = unknown>(url: UrlInput, data?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'data'>) =>
      request<T>(url, { ...config, method: Method.POST, data }),
    put: <T = unknown>(url: UrlInput, data?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'data'>) =>
      request<T>(url, { ...config, method: Method.PUT, data }),
    patch: <T = unknown>(url: UrlInput, data?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'data'>) =>
      request<T>(url, { ...config, method: Method.PATCH, data }),
  }
}

export function createFetchClient(defaultConfig: ApiRequestConfig = {}) {
  return createRequestMethods(defaultConfig)
}

export const api = createFetchClient({
  baseURL: VITE_BACKEND_URL || '',
  credentials: 'include',
})

export const apiFetch = api.request

export default api

const joinApiPath = (path: string): string => {
  const prefix = import.meta.env.VITE_API_PREFIX ?? '/api'
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${prefix.replace(/\/$/, '')}${normalized}`
}

export type AuthUserDto = {
  id: number
  login: string
}

export type ApiErrorBody = {
  error: {
    code: string
    message: string
  }
}

export class AuthApiError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'AuthApiError'
    this.code = code
  }
}

const readJsonBody = async (response: Response): Promise<unknown> => {
  const text = await response.text()
  if (text.length === 0) {
    return null
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  jsonBody?: unknown
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const url = joinApiPath(path)
  const { jsonBody, headers, method = 'GET', ...rest } = options
  const hasJsonBody = jsonBody !== undefined && method !== 'GET' && method !== 'HEAD'

  const response = await fetch(url, {
    credentials: 'include',
    method,
    ...rest,
    headers: {
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(hasJsonBody ? { body: JSON.stringify(jsonBody) } : {}),
  })

  const body = (await readJsonBody(response)) as unknown

  if (!response.ok) {
    const errBody = body as ApiErrorBody | null
    const message =
      errBody && typeof errBody.error?.message === 'string'
        ? errBody.error.message
        : `Запрос завершился с кодом ${String(response.status)}`
    const code =
      errBody && typeof errBody.error?.code === 'string' ? errBody.error.code : 'UNKNOWN'
    throw new AuthApiError(code, message)
  }

  return body as T
}

export const authRegister = async (login: string, password: string): Promise<{ user: AuthUserDto }> => {
  return await request<{ user: AuthUserDto }>('/register', {
    method: 'POST',
    jsonBody: { login, password },
  })
}

export const authLogin = async (login: string, password: string): Promise<{ user: AuthUserDto }> => {
  return await request<{ user: AuthUserDto }>('/login', {
    method: 'POST',
    jsonBody: { login, password },
  })
}

export const authLogout = async (): Promise<void> => {
  await request<{ ok: boolean }>('/logout', {
    method: 'POST',
    jsonBody: {},
  })
}

export const authMe = async (): Promise<{ user: AuthUserDto } | null> => {
  try {
    return await request<{ user: AuthUserDto }>('/me', { method: 'GET' })
  } catch (error: unknown) {
    if (error instanceof AuthApiError && error.code === 'UNAUTHORIZED') {
      return null
    }
    throw error
  }
}

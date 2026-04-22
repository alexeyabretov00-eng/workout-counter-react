const defaultApiPrefix = (): string => import.meta.env.VITE_API_PREFIX ?? '/api';

/** Собирает URL относительно префикса API (по умолчанию `VITE_API_PREFIX` или `/api`). */
export const joinApiPath = (path: string, apiPrefix: string = defaultApiPrefix()): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${apiPrefix.replace(/\/$/, '')}${normalized}`;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export class ApiRequestError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
  }
}

const readJsonBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (text.length === 0) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

export type ApiJsonRequestOptions = Omit<RequestInit, 'body'> & {
  jsonBody?: unknown;
};

export type ApiErrorConstructor = new (
  code: string,
  message: string,
) => Error & { readonly code: string };

/** JSON-запросы к API с `credentials: 'include'` и разбором тела ошибки {@link ApiErrorBody}. */
export class ApiJsonClient {
  private readonly apiPrefix: string;
  private readonly errorCtor: ApiErrorConstructor;

  constructor(
    apiPrefix: string = defaultApiPrefix(),
    errorCtor: ApiErrorConstructor = ApiRequestError,
  ) {
    this.apiPrefix = apiPrefix;
    this.errorCtor = errorCtor;
  }

  async request<T>(path: string, options: ApiJsonRequestOptions = {}): Promise<T> {
    const url = joinApiPath(path, this.apiPrefix);
    const { jsonBody, headers, method = 'GET', ...rest } = options;
    const hasJsonBody = jsonBody !== undefined && method !== 'GET' && method !== 'HEAD';

    const response = await fetch(url, {
      credentials: 'include',
      method,
      ...rest,
      headers: {
        ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(hasJsonBody ? { body: JSON.stringify(jsonBody) } : {}),
    });

    const body = (await readJsonBody(response)) as unknown;

    if (!response.ok) {
      const errBody = body as ApiErrorBody | null;
      const message =
        errBody && typeof errBody.error?.message === 'string'
          ? errBody.error.message
          : `Запрос завершился с кодом ${String(response.status)}`;
      const code =
        errBody && typeof errBody.error?.code === 'string' ? errBody.error.code : 'UNKNOWN';
      throw new this.errorCtor(code, message);
    }

    return body as T;
  }
}

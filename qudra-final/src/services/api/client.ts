export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

const TOKEN_KEY = 'qudra_auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export interface ApiErrorData {
  status: number;
  detail: string;
  isTimeout: boolean;
  isNetworkError: boolean;
  isColdStart: boolean;
  retryAfter: number | null;
}

function makeError(
  status: number,
  detail: string,
  opts: Partial<ApiErrorData> = {},
): ApiErrorData {
  return {
    status,
    detail,
    isTimeout: opts.isTimeout ?? false,
    isNetworkError: opts.isNetworkError ?? false,
    isColdStart: opts.isColdStart ?? false,
    retryAfter: opts.retryAfter ?? null,
  };
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(res: Response): Promise<ApiErrorData> {
  let detail = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    if (body.detail) {
      detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
    }
  } catch {
    // response has no JSON body
  }

  if (res.status === 401) detail = 'انتهت الجلسة أو التوكن غير صالح. يرجى إعادة تسجيل الدخول.';
  if (res.status === 403) detail = 'لا تملك صلاحية للوصول لهذا المورد.';
  if (res.status === 404) detail = 'المورد المطلوب غير موجود.';
  if (res.status === 409) detail = 'هذا البريد مسجل مسبقاً.';
  if (res.status === 422) detail = 'البيانات المُدخلة غير صالحة. تحقق من الحقول.';
  if (res.status === 429) detail = 'تجاوزت حد الطلبات المسموح. يرجى الانتظار قليلاً.';
  if (res.status >= 500) detail = 'خطأ في الخادم. يرجى المحاولة لاحقاً.';

  return makeError(res.status, detail, {
    retryAfter: res.headers.get('Retry-After') ? parseInt(res.headers.get('Retry-After')!) : null,
  });
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export async function apiPost<T>(path: string, body?: unknown, isForm = false): Promise<T> {
  return request<T>('POST', path, body, isForm);
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PATCH', path, body);
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isForm = false,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    ...authHeaders(),
  };

  if (!isForm && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? (isForm ? (body as string) : JSON.stringify(body)) : undefined,
    });
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('timed out')) {
      throw makeError(0, 'انتهى وقت الانتظار. الخادم قد يكون نائماً، يرجى المحاولة مرة أخرى.', {
        isTimeout: true,
        isColdStart: true,
      });
    }
    throw makeError(0, 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.', {
      isNetworkError: true,
      isColdStart: true,
    });
  }

  if (res.status === 503) {
    throw makeError(503, 'الخادم يستيقظ من السبات. يرجى الانتظار ثم المحاولة مرة أخرى.', {
      isColdStart: true,
    });
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

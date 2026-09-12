/**
 * Central API HTTP Client — QUDRA
 * Production-ready fetch wrapper handling headers, JWT auth injection,
 * timeouts, Render cold starts, and typed error transformations.
 */

import {
  ApiException,
  AuthException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
  ConflictException,
  ServerException,
  TimeoutException,
  NetworkException,
} from './errors';
import { HttpMethod, RequestOptions } from './types';

const TOKEN_STORAGE_KEY = 'qudra_auth_token';
const DEFAULT_TIMEOUT_MS = 30000;

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://qudra-5tqh.onrender.com').replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  public setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Storage unavailable
    }
  }

  public clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  /**
   * Central internal request executor
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
    isFormData = false
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      ...options.headers,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (!options.skipAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const startTime = Date.now();

    try {
      let requestBody: BodyInit | undefined = undefined;
      if (body !== undefined) {
        if (isFormData) {
          requestBody = body as BodyInit;
        } else {
          requestBody = JSON.stringify(body);
        }
      }

      const response = await fetch(url.toString(), {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Successful JSON response
      if (response.ok) {
        if (response.status === 204) {
          return null as T;
        }
        const text = await response.text();
        return text ? (JSON.parse(text) as T) : (null as T);
      }

      // Handle non-2xx HTTP errors
      let errorPayload: any = undefined;
      try {
        errorPayload = await response.json();
      } catch {
        // Not JSON error body
      }

      const errorMessage =
        (typeof errorPayload?.detail === 'string' ? errorPayload.detail : '') ||
        errorPayload?.message ||
        `طلب الخادم فشل مع رمز الحالة ${response.status}`;

      if (response.status === 401) {
        this.clearToken();
        throw new AuthException(errorMessage || 'جلسة غير صالحة، يرجى إعادة تسجيل الدخول.', errorPayload);
      }
      if (response.status === 403) {
        throw new ForbiddenException(errorMessage, errorPayload);
      }
      if (response.status === 404) {
        throw new NotFoundException(errorMessage, errorPayload);
      }
      if (response.status === 409) {
        throw new ConflictException(errorMessage, errorPayload);
      }
      if (response.status === 422) {
        throw new ValidationException(errorMessage, errorPayload);
      }
      if (response.status >= 500) {
        throw new ServerException(errorMessage, response.status, errorPayload);
      }

      throw new ApiException(errorMessage, response.status, errorPayload);
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiException) {
        throw err;
      }

      const elapsed = Date.now() - startTime;
      const isTimeout = (err as Error)?.name === 'AbortError' || elapsed >= timeoutMs;

      if (isTimeout) {
        throw new TimeoutException();
      }

      // Cold start hint if connection failed after long wait
      if (elapsed > 8000) {
        throw new TimeoutException('الخادم قيد الاستيقاظ على Render. يرجى الانتظار ثوانٍ والمحاولة ثانية.');
      }

      throw new NetworkException((err as Error)?.message || 'تعذر الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت.');
    }
  }

  // Public HTTP Verb shortcuts
  public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  public async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  public async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  public async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  public async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * OAuth2 URL-encoded form POST (specifically for FastAPI /api/v1/auth/login)
   */
  public async postForm<T>(endpoint: string, formData: Record<string, string>, options?: RequestOptions): Promise<T> {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([k, v]) => params.append(k, v));

    const formOptions: RequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return this.request<T>('POST', endpoint, params.toString(), formOptions, true);
  }
}

export const apiClient = new ApiClient();

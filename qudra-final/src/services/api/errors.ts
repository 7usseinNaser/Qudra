/**
 * Central API Errors & Exception Classes — QUDRA
 * Provides clear, categorized exceptions and user-friendly Arabic messaging.
 */

import { ApiErrorPayload } from './types';

export class ApiException extends Error {
  public readonly status: number;
  public readonly payload?: ApiErrorPayload;
  public readonly isNetworkError: boolean;
  public readonly isTimeout: boolean;
  public readonly isColdStart: boolean;

  constructor(
    message: string,
    status = 0,
    payload?: ApiErrorPayload,
    isNetworkError = false,
    isTimeout = false,
    isColdStart = false
  ) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.payload = payload;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
    this.isColdStart = isColdStart;
  }
}

export class AuthException extends ApiException {
  constructor(message = 'جلسة المستخدم غير صالحة أو منتهية، يرجى تسجيل الدخول مجدداً.', payload?: ApiErrorPayload) {
    super(message, 401, payload);
    this.name = 'AuthException';
  }
}

export class ForbiddenException extends ApiException {
  constructor(message = 'ليس لديك صلاحية لتنفيذ هذا الإجراء.', payload?: ApiErrorPayload) {
    super(message, 403, payload);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends ApiException {
  constructor(message = 'العنصر المطلوب غير موجود في الخادم.', payload?: ApiErrorPayload) {
    super(message, 404, payload);
    this.name = 'NotFoundException';
  }
}

export class ValidationException extends ApiException {
  public readonly validationErrors: string[];

  constructor(message = 'البيانات المدخلة غير صحيحة، يرجى التحقق من الحقول.', payload?: ApiErrorPayload) {
    super(message, 422, payload);
    this.name = 'ValidationException';

    const errors: string[] = [];
    if (payload?.detail && Array.isArray(payload.detail)) {
      payload.detail.forEach(err => {
        const field = err.loc ? err.loc[err.loc.length - 1] : '';
        errors.push(`${field ? field + ': ' : ''}${err.msg}`);
      });
    }
    this.validationErrors = errors;
  }
}

export class ConflictException extends ApiException {
  constructor(message = 'البيانات المدخلة مكررة أو تتعارض مع سجل موجود مسبقاً.', payload?: ApiErrorPayload) {
    super(message, 409, payload);
    this.name = 'ConflictException';
  }
}

export class ServerException extends ApiException {
  constructor(message = 'حدث خطأ في الخادم أثناء معالجة الطلب، يرجى المحاولة لاحقاً.', status = 500, payload?: ApiErrorPayload) {
    super(message, status, payload);
    this.name = 'ServerException';
  }
}

export class TimeoutException extends ApiException {
  constructor(message = 'استغرق الاتصال بالخادم وقتاً أطول من المتوقع، قد يكون الخادم في مرحلة الاستيقاظ. يرجى إعادة المحاولة.') {
    super(message, 504, undefined, false, true, true);
    this.name = 'TimeoutException';
  }
}

export class NetworkException extends ApiException {
  constructor(message = 'تعذر الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت.') {
    super(message, 0, undefined, true, false, false);
    this.name = 'NetworkException';
  }
}

/**
 * Extracts a human-readable Arabic error message from any error object.
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof ApiException) {
    if (error.isColdStart || error.isTimeout) {
      return 'الخادم يستيقظ حالياً على منصة Render، يرجى الانتظار ثوانٍ ثم إعادة المحاولة.';
    }
    if (error.isNetworkError) {
      return 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.';
    }
    if (error instanceof ValidationException && error.validationErrors.length > 0) {
      return `بيانات غير صالحة: ${error.validationErrors.slice(0, 2).join(' | ')}`;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.';
}

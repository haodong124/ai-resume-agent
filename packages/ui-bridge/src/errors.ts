export enum ErrorCode {
  // Client errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  
  // Business errors
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  FEATURE_DISABLED = 'FEATURE_DISABLED',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
  
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    }
  }
}

export function createError(
  code: ErrorCode,
  message: string,
  statusCode?: number,
  details?: any
): AppError {
  return new AppError(code, message, statusCode, details)
}

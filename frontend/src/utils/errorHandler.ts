import axios, { AxiosError } from 'axios';

export class ErrorHandler {
  static getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return axiosError.response?.data?.message || axiosError.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  static isNotFoundError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 404;
    }
    return false;
  }

  static isAuthenticationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 401;
    }
    return false;
  }

  static isAuthorizationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 403;
    }
    return false;
  }

  static isValidationError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 400;
    }
    return false;
  }

  static isServerError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return error.response?.status ? error.response.status >= 500 : false;
    }
    return false;
  }

  static handleApiError(error: unknown): never {
    const message = this.getErrorMessage(error);
    throw new Error(message);
  }
} 
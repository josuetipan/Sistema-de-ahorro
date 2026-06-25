// Tipos de respuesta y petición de la API REST
import type { ApiError, PaginatedResponse } from './common';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export type { ApiError, PaginatedResponse };

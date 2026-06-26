// Tipos compartidos: paginación, respuestas genéricas y metadatos
export interface Paginacion {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Paginacion;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type ID = string | number;

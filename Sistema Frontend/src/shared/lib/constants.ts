// Constantes globales del proyecto (roles, estados, límites)
export const APP_NAME = 'Sistema de Ahorro';

export const ROLES = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  OPERADOR: 'operador',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

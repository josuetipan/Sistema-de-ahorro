import { BadRequestException } from '@nestjs/common';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

const DEFAULTS = { page: 1, limit: 20, maxLimit: 100 };

/**
 * Convierte los query params `page` y `limit` en parámetros de paginación.
 * Aplica valores por defecto (page=1, limit=20) y valida los límites.
 */
export function parsePagination(
  page?: string,
  limit?: string,
  maxLimit: number = DEFAULTS.maxLimit,
): PaginationParams {
  let pageNum = DEFAULTS.page;
  let limitNum = DEFAULTS.limit;

  if (page !== undefined) {
    pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      throw new BadRequestException('page debe ser un entero mayor o igual a 1');
    }
  }

  if (limit !== undefined) {
    limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > maxLimit) {
      throw new BadRequestException(
        `limit debe ser un entero entre 1 y ${maxLimit}`,
      );
    }
  }

  return { page: pageNum, limit: limitNum, skip: (pageNum - 1) * limitNum };
}

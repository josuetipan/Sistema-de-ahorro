import { env } from '@shared/config/env';
import type { ICreditoRepository } from '../../domain/credito.repository';
import { CreditoHttpAdapter } from './credito-http.adapter';
import { CreditoMockAdapter } from './credito-mock.adapter';

export function createCreditoRepository(): ICreditoRepository {
  return env.VITE_MOCK_AUTH ? new CreditoMockAdapter() : new CreditoHttpAdapter();
}

export const creditoRepository = createCreditoRepository();

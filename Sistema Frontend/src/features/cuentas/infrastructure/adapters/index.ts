import { env } from '@shared/config/env';
import type { ICuentaRepository } from '../../domain/cuenta.repository';
import { CuentaHttpAdapter } from './cuenta-http.adapter';
import { CuentaMockAdapter } from './cuenta-mock.adapter';

export function createCuentaRepository(): ICuentaRepository {
  return env.VITE_MOCK_AUTH ? new CuentaMockAdapter() : new CuentaHttpAdapter();
}

export const cuentaRepository = createCuentaRepository();

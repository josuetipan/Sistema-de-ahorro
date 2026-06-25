import type { TransferenciaInput } from '../domain/transferencia.rules';

export interface ITransferenciaRepository {
  realizar(input: TransferenciaInput): Promise<void>;
  getHistorial(): Promise<unknown[]>;
}

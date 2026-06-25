import type { Credito, SolicitudCreditoInput } from './credito.entity';

export interface ICreditoRepository {
  consultarTodos(): Promise<Credito[]>;
  solicitar(input: SolicitudCreditoInput): Promise<void>;
  pagarCuota(creditoId: string, cuotaNumero: number): Promise<void>;
}

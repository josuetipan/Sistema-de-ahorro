import type { ICreditoRepository } from '../../domain/credito.repository';
import type { Credito, SolicitudCreditoInput } from '../../domain/credito.entity';
import { MOCK_CREDITOS } from '../mocks/credito.mock';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class CreditoMockAdapter implements ICreditoRepository {
  private creditos = [...MOCK_CREDITOS];

  async consultarTodos(): Promise<Credito[]> {
    await delay();
    return [...this.creditos];
  }

  async solicitar(input: SolicitudCreditoInput): Promise<void> {
    await delay(600);
    void input;
  }

  async pagarCuota(creditoId: string, cuotaNumero: number): Promise<void> {
    await delay();
    void creditoId;
    void cuotaNumero;
  }
}

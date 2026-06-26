import { httpClient } from '@shared/lib/httpClient';
import { API_CONFIG } from '@shared/config/api';
import type { Credito } from '../../domain/credito.entity';
import type { ICreditoRepository } from '../../domain/credito.repository';
import type { SolicitudCreditoInput } from '../../domain/credito.entity';
import * as creditoApi from '../api/credito.api';

export class CreditoHttpAdapter implements ICreditoRepository {
  async consultarTodos(): Promise<Credito[]> {
    const { data } = await httpClient.get<Credito[]>(API_CONFIG.endpoints.creditos);
    return data;
  }

  async solicitar(input: SolicitudCreditoInput): Promise<void> {
    await creditoApi.postSolicitudCredito({
      monto: input.monto,
      plazoMeses: input.plazoMeses,
      cuentaId: input.cuentaId ?? 'default',
      tipoCredito: input.tipoCredito,
      motivo: input.motivo,
      ingresos: input.ingresos,
    });
  }

  async pagarCuota(creditoId: string, cuotaNumero: number): Promise<void> {
    await creditoApi.postPagarCuota(creditoId, cuotaNumero);
  }
}

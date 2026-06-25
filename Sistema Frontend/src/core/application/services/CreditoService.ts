// Servicio de aplicación para operaciones de crédito
import { Credito } from '@core/domain/entities/Credito';
import type { Dinero } from '@core/domain/valueObjects/Dinero';
import type { ICreditoRepository } from '@core/domain/ports/ICreditoRepository';

export class CreditoService {
  constructor(private readonly creditoRepo: ICreditoRepository) {}

  async solicitar(cuentaId: string, monto: Dinero, plazoMeses: number): Promise<Credito> {
    const credito = new Credito(crypto.randomUUID(), monto, plazoMeses);
    void cuentaId;
    return this.creditoRepo.save(credito);
  }
}

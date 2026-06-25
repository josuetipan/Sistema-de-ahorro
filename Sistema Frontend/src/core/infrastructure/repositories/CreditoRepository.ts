// Implementación concreta del puerto ICreditoRepository vía HTTP
import type { ICreditoRepository } from '@core/domain/ports/ICreditoRepository';
import type { Credito } from '@core/domain/entities/Credito';
import { HttpAdapter } from '../adapters/http/httpAdapter';

export class CreditoRepository implements ICreditoRepository {
  constructor(private readonly http = new HttpAdapter()) {}

  async findById(id: string): Promise<Credito | null> {
    void id;
    void this.http;
    return null;
  }

  async findByCuentaId(cuentaId: string): Promise<Credito[]> {
    void cuentaId;
    return [];
  }

  async save(credito: Credito): Promise<Credito> {
    return credito;
  }

  async update(credito: Credito): Promise<Credito> {
    return credito;
  }
}

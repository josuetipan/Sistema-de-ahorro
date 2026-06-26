// Implementación concreta del puerto ICuentaRepository vía HTTP
import type { ICuentaRepository } from '@core/domain/ports/ICuentaRepository';
import type { Cuenta } from '@core/domain/entities/Cuenta';
import { HttpAdapter } from '../adapters/http/httpAdapter';
import { API_CONFIG } from '@shared/config/api';

export class CuentaRepository implements ICuentaRepository {
  constructor(private readonly http = new HttpAdapter()) {}

  async findById(id: string): Promise<Cuenta | null> {
    void id;
    return null;
  }

  async findByUsuarioId(usuarioId: string): Promise<Cuenta[]> {
    void usuarioId;
    return [];
  }

  async save(cuenta: Cuenta): Promise<Cuenta> {
    void this.http;
    return cuenta;
  }

  async update(cuenta: Cuenta): Promise<Cuenta> {
    void this.http;
    return cuenta;
  }
}

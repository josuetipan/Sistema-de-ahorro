// Servicio de aplicación para operaciones de cuentas
import { Cuenta } from '@core/domain/entities/Cuenta';
import type { Dinero } from '@core/domain/valueObjects/Dinero';
import type { ICuentaRepository } from '@core/domain/ports/ICuentaRepository';

export class CuentaService {
  constructor(private readonly cuentaRepo: ICuentaRepository) {}

  async crearCuenta(_usuarioId: string, numero: string, saldo: Dinero): Promise<Cuenta> {
    const cuenta = new Cuenta(crypto.randomUUID(), numero, saldo);
    return this.cuentaRepo.save(cuenta);
  }

  async transferir(origenId: string, destinoId: string, monto: Dinero): Promise<void> {
    const origen = await this.cuentaRepo.findById(origenId);
    const destino = await this.cuentaRepo.findById(destinoId);
    if (!origen || !destino) throw new Error('Cuenta no encontrada');
    origen.retirar(monto);
    destino.depositar(monto);
    await this.cuentaRepo.update(origen);
    await this.cuentaRepo.update(destino);
  }
}

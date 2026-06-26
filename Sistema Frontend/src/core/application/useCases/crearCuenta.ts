// Caso de uso: crear una nueva cuenta bancaria
import { Cuenta } from '@core/domain/entities/Cuenta';
import { Dinero } from '@core/domain/valueObjects/Dinero';
import type { CuentaService } from '../services/CuentaService';

export interface CrearCuentaInput {
  usuarioId: string;
  numero: string;
  moneda?: string;
}

export async function crearCuenta(cuentaService: CuentaService, input: CrearCuentaInput): Promise<Cuenta> {
  const saldoInicial = new Dinero(0, input.moneda ?? 'MXN');
  return cuentaService.crearCuenta(input.usuarioId, input.numero, saldoInicial);
}

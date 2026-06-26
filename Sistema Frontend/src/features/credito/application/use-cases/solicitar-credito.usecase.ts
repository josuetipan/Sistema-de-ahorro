import type { ICreditoRepository } from '../../domain/credito.repository';
import type { SolicitudCreditoInput } from '../../domain/credito.entity';
import { calcularCuotaMensual, validarCapacidadPago } from '../../domain/credito.rules';

export async function solicitarCreditoUseCase(
  repository: ICreditoRepository,
  input: SolicitudCreditoInput,
): Promise<void> {
  const cuota = calcularCuotaMensual(input.monto, input.plazoMeses);
  const errorCapacidad = validarCapacidadPago(input.ingresos, cuota);
  if (errorCapacidad) throw new Error(errorCapacidad);

  await repository.solicitar(input);
}

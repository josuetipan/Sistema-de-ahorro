import type { Credito } from './credito.entity';

const TASA_ANUAL_DEFAULT = 0.18;

export function calcularCuotaMensual(
  monto: number,
  plazoMeses: number,
  tasaAnual = TASA_ANUAL_DEFAULT,
): number {
  const r = tasaAnual / 12;
  if (plazoMeses <= 0 || monto <= 0) return 0;
  if (r === 0) return monto / plazoMeses;
  return (monto * r * Math.pow(1 + r, plazoMeses)) / (Math.pow(1 + r, plazoMeses) - 1);
}

export function validarCapacidadPago(ingresos: number, cuotaEstimada: number): string | null {
  if (cuotaEstimada > ingresos * 0.4) {
    return 'La cuota estimada supera el 40% de tus ingresos mensuales.';
  }
  return null;
}

export interface CuotaAmortizacion {
  numero: number;
  fecha: string;
  capital: number;
  interes: number;
  total: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
}

export function buildAmortizacion(credito: Credito): CuotaAmortizacion[] {
  const cuotas: CuotaAmortizacion[] = [];
  const r = credito.tasaAnual / 12;
  let saldo = credito.monto;
  const cuota =
    r === 0
      ? credito.monto / credito.plazoMeses
      : (credito.monto * r * Math.pow(1 + r, credito.plazoMeses)) /
        (Math.pow(1 + r, credito.plazoMeses) - 1);

  for (let i = 1; i <= credito.plazoMeses; i++) {
    const interes = saldo * r;
    const capital = cuota - interes;
    saldo -= capital;
    const fecha = new Date(2026, i, 15);
    let estado: CuotaAmortizacion['estado'] = 'pendiente';
    if (i <= credito.cuotasPagadas) estado = 'pagada';

    cuotas.push({
      numero: i,
      fecha: fecha.toISOString(),
      capital: Math.round(capital * 100) / 100,
      interes: Math.round(interes * 100) / 100,
      total: Math.round(cuota * 100) / 100,
      estado,
    });
  }
  return cuotas;
}

export const TIPOS_CREDITO = ['Personal', 'Consumo', 'Negocio', 'Vivienda'] as const;

export const LABEL_ESTADO_CREDITO: Record<Credito['estado'], string> = {
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  pendiente: 'Pendiente',
  activo: 'Activo',
  pagado: 'Pagado',
  vencido: 'Vencido',
};

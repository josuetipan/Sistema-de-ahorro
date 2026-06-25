import { META_MENSUAL_OBLIGATORIA, type PagoAhorro, type ResumenAhorro } from './pago.entity';

export type EstadoMesAhorro = 'completo' | 'incompleto' | 'atrasado';

export interface MesCalendario {
  mes: string;
  anio: number;
  mesNumero: number;
  meta: number;
  aportado: number;
  estado: EstadoMesAhorro;
  esFuturo: boolean;
  pagoId?: string;
}

export const LABEL_ESTADO_MES: Record<EstadoMesAhorro, string> = {
  completo: 'Pago completo',
  incompleto: 'Incompleto',
  atrasado: 'Atrasado',
};

const ESTADO_BADGE: Record<EstadoMesAhorro, string> = {
  completo: 'aprobado',
  incompleto: 'pendiente',
  atrasado: 'rechazado',
};

export function estadoMesToBadge(estado: EstadoMesAhorro): string {
  return ESTADO_BADGE[estado];
}

export function mesDesdeFecha(fecha: string): string {
  return fecha.slice(0, 7);
}

export function mesActual(): string {
  return new Date().toISOString().slice(0, 7);
}

export function calcularResumenAhorro(
  pagos: PagoAhorro[],
  mesReferencia: string = mesActual(),
): ResumenAhorro {
  const metaMensual = META_MENSUAL_OBLIGATORIA;

  const verificadosMes = pagos
    .filter((p) => p.estado === 'VERIFICADO' && p.mes === mesReferencia)
    .reduce((sum, p) => sum + p.monto, 0);

  const saldoDisponible = pagos
    .filter((p) => p.estado === 'VERIFICADO')
    .reduce((sum, p) => sum + p.monto, 0);

  const saldoPendiente = pagos
    .filter((p) => p.estado === 'PENDIENTE_VERIFICACION')
    .reduce((sum, p) => sum + p.monto, 0);

  const progresoMes = verificadosMes;
  const progresoPorcentaje = Math.min(Math.round((progresoMes / metaMensual) * 100), 100);
  const metaCumplida = progresoMes >= metaMensual;
  const excedenteMes = Math.max(0, progresoMes - metaMensual);

  return {
    metaMensual,
    progresoMes,
    progresoPorcentaje,
    metaCumplida,
    excedenteMes,
    saldoDisponible,
    saldoPendiente,
  };
}

export function generarComprobantePago(): string {
  const secuencia = String(Math.floor(Math.random() * 90000) + 10000);
  return `APO-2026-${secuencia}`;
}

/** Solo pagos VERIFICADOS cuentan para el calendario anual. */
export function buildCalendarioAnualFromPagos(pagos: PagoAhorro[], anio: number): MesCalendario[] {
  const meta = META_MENSUAL_OBLIGATORIA;
  const hoy = new Date();
  const mesActualNum = hoy.getMonth() + 1;
  const verificados = pagos.filter((p) => p.estado === 'VERIFICADO');

  return Array.from({ length: 12 }, (_, i) => {
    const mesNumero = i + 1;
    const mesKey = `${anio}-${String(mesNumero).padStart(2, '0')}`;
    const pagosMes = verificados.filter((p) => p.mes === mesKey);
    const aportado = pagosMes.reduce((sum, p) => sum + p.monto, 0);
    const nombreMes = new Date(anio, i, 1).toLocaleDateString('es', { month: 'long' });
    const esFuturo =
      anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mesNumero > mesActualNum);
    const esPasado =
      anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mesNumero < mesActualNum);

    let estado: EstadoMesAhorro;
    if (aportado >= meta) {
      estado = 'completo';
    } else if (esPasado) {
      estado = 'atrasado';
    } else {
      estado = 'incompleto';
    }

    return {
      mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      anio,
      mesNumero,
      meta,
      aportado,
      estado,
      esFuturo,
      pagoId: pagosMes[0]?.id,
    };
  });
}

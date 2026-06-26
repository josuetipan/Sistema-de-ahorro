// Caso de uso: generar reporte financiero con filtros
export interface GenerarReporteInput {
  fechaInicio: string;
  fechaFin: string;
  tipo?: string;
}

export interface ReporteResultado {
  totalMovimientos: number;
  montoTotal: number;
}

export async function generarReporte(_input: GenerarReporteInput): Promise<ReporteResultado> {
  return { totalMovimientos: 0, montoTotal: 0 };
}

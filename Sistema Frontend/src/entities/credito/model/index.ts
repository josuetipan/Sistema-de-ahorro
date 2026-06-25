// Tipos del slice crédito: Credito, EstadoCredito y Cuota
export type EstadoCredito = 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'pagado' | 'vencido';

export interface Cuota {
  numero: number;
  monto: number;
  fechaVencimiento: string;
  pagada: boolean;
}

export interface Credito {
  id: string;
  monto: number;
  tasaInteres: number;
  plazoMeses: number;
  estado: EstadoCredito;
  cuentaId: string;
  cuotas: Cuota[];
  createdAt: string;
}

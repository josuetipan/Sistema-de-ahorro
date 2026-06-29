import { z } from 'zod';

/** Colores soportados (valor hex enviado al backend). */
export const COLORES_CUENTA = [
  { label: 'Verde', value: '#22c55e' },
  { label: 'Azul', value: '#0ea5e9' },
  { label: 'Ámbar', value: '#f59e0b' },
] as const;

/** Iconos soportados por la UI. */
export const ICONOS_CUENTA = [
  { label: 'Ahorro', value: 'savings' },
  { label: 'Escudo', value: 'shield' },
  { label: 'Rayo', value: 'zap' },
] as const;

export const crearCuentaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres'),
  color: z.string().min(1, 'Selecciona un color'),
  icono: z.string().min(1, 'Selecciona un icono'),
});

export type CrearCuentaFormData = z.infer<typeof crearCuentaSchema>;

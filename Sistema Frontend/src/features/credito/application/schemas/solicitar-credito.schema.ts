import { z } from 'zod';

export const solicitarCreditoSchema = z.object({
  monto: z.coerce.number().positive('El monto debe ser mayor a cero'),
  plazoMeses: z.coerce.number().int().min(3, 'Mínimo 3 meses').max(60, 'Máximo 60 meses'),
  motivo: z.string().min(10, 'Describe el motivo con al menos 10 caracteres'),
  tipoCredito: z.string().min(1, 'Selecciona un tipo de crédito'),
  ingresos: z.coerce.number().positive('Los ingresos deben ser mayores a cero'),
});

export type SolicitarCreditoFormData = z.infer<typeof solicitarCreditoSchema>;

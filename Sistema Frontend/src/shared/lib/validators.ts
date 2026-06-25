// Schemas Zod reutilizables para validación de formularios
import { z } from 'zod';

export const emailSchema = z.string().email('Correo electrónico inválido');

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
  .regex(/[0-9]/, 'Debe incluir al menos un número');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Nombre demasiado corto'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const montoSchema = z.number().positive('El monto debe ser mayor a cero');

export const solicitudCreditoSchema = z.object({
  monto: z.coerce.number().positive('El monto debe ser mayor a cero'),
  plazoMeses: z.coerce.number().int().min(3, 'Mínimo 3 meses').max(60, 'Máximo 60 meses'),
  motivo: z.string().min(10, 'Describe el motivo con al menos 10 caracteres'),
  tipoCredito: z.string().min(1, 'Selecciona un tipo de crédito'),
  ingresos: z.coerce.number().positive('Los ingresos deben ser mayores a cero'),
});

export const perfilSchema = z.object({
  telefono: z.string().min(10, 'Teléfono inválido'),
  direccion: z.string().min(5, 'Dirección demasiado corta'),
  email: emailSchema,
});

export const cambioPasswordSchema = z
  .object({
    actual: z.string().min(1, 'Ingresa tu contraseña actual'),
    nueva: passwordSchema,
    confirmar: z.string(),
  })
  .refine((d) => d.nueva === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SolicitudCreditoFormData = z.infer<typeof solicitudCreditoSchema>;
export type PerfilFormData = z.infer<typeof perfilSchema>;
export type CambioPasswordFormData = z.infer<typeof cambioPasswordSchema>;

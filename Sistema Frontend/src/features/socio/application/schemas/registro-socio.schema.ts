import { z } from 'zod';

const camposBase = {
  nombres: z.string().min(3, 'Ingresa el nombre completo'),
  cedula: z
    .string()
    .min(10, 'La cédula debe tener al menos 10 dígitos')
    .max(13, 'La cédula no puede exceder 13 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  telefono: z.string().min(7, 'Ingresa un teléfono válido'),
};

export const registroPublicoSocioSchema = z.object({
  ...camposBase,
  codigoReferenciaIngresado: z
    .string()
    .min(1, 'El código de referencia es obligatorio')
    .regex(/^SOC-[A-Z0-9]{6}$/i, 'Formato inválido. Use SOC-XXXXXX'),
});

export const crearSocioAdminSchema = z.object({
  ...camposBase,
  codigoReferenciaIngresado: z.string().optional(),
});

export type RegistroPublicoSocioFormData = z.infer<typeof registroPublicoSocioSchema>;
export type CrearSocioAdminFormData = z.infer<typeof crearSocioAdminSchema>;

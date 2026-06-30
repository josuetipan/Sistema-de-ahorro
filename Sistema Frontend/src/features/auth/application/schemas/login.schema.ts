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
    fullName: z.string().min(3, 'Ingresa el nombre completo'),
    identification: z
      .string()
      .min(10, 'La identificacion debe tener al menos 10 digitos')
      .max(13, 'La identificacion no puede exceder 13 caracteres'),
    email: emailSchema,
    phoneNumber: z.string().min(7, 'Ingresa un telefono valido'),
    password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

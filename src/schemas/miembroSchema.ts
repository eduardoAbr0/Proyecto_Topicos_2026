import { z } from 'zod';

export const miembroSchema = z.object({
  nombre: z.string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(50, { message: 'El nombre no puede exceder 50 caracteres' }),
  primer_apellido: z.string()
    .min(1, { message: 'El primer apellido es obligatorio' })
    .max(50, { message: 'El primer apellido no puede exceder 50 caracteres' }),
  segundo_apellido: z.string()
    .max(50, { message: 'El segundo apellido no puede exceder 50 caracteres' })
    .optional()
    .nullable(),
  telefono: z.string()
    .min(1, { message: 'El teléfono es obligatorio' })
    .max(20, { message: 'El teléfono no puede exceder 20 caracteres' })
    .regex(/^\d+$/, { message: 'El teléfono solo debe contener números' }),
  email: z.string()
    .min(1, { message: 'El correo electrónico es obligatorio' })
    .max(100, { message: 'El correo electrónico no puede exceder 100 caracteres' })
    .email({ message: 'El formato del correo es inválido' }),
  numero_casa: z.string()
    .max(10, { message: 'El número de casa no puede exceder 10 caracteres' })
    .regex(/^\d+$/, { message: 'El número de casa debe ser un número positivo' })
    .optional()
    .nullable(),
  calle: z.string()
    .max(25, { message: 'La calle no puede exceder 25 caracteres' })
    .optional()
    .nullable(),
  colonia: z.string()
    .max(25, { message: 'La colonia no puede exceder 25 caracteres' })
    .optional()
    .nullable(),
  cp: z.string()
    .max(10, { message: 'El código postal no puede exceder 10 caracteres' })
    .optional()
    .nullable(),
  estado_membresia: z.string().refine(
    (val) => ['Sin pagar', 'Pagada', 'Financiada'].includes(val),
    { message: "El estado de membresía no es válido" }
  ).nullable(),
  fecha_pago_cuota: z.string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Fecha de pago inválida' })
});

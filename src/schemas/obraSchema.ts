import { z } from 'zod';

export const obraSchema = z.object({
  titulo: z.string()
    .min(1, { message: 'El título es obligatorio' })
    .max(100, { message: 'El título no puede exceder 100 caracteres' }),
  autor: z.string()
    .max(100, { message: 'El autor no puede exceder 100 caracteres' })
    .optional()
    .nullable(),
  tipo: z.string().refine(
    (val) => ['Drama', 'Comedia', 'Suspenso', 'Musical', 'Terror', 'Romance'].includes(val),
    { message: 'El tipo de obra no es válido' }
  ).nullable(),
  num_actos: z.string()
    .regex(/^\d+$/, { message: 'El número de actos debe ser un número positivo' })
    .optional()
    .nullable(),
  anio_presentacion: z.string()
    .regex(/^\d{4}$/, { message: 'El año de presentación debe ser un año válido de 4 dígitos' })
    .optional()
    .nullable(),
  temporada: z.string().refine(
    (val) => ['Primavera', 'Verano', 'Otoño', 'Invierno'].includes(val),
    { message: 'La temporada no es válida' }
  ).nullable(),
  productor: z.string()
    .regex(/^\d+$/, { message: 'El productor debe ser un número positivo' })
    .optional()
    .nullable(),
  descripcion: z.string()
    .optional()
    .nullable()
});

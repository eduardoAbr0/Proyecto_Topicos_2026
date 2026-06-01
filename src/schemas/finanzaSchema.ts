import { z } from 'zod';

export const finanzaSchema = z.object({
  fecha: z.string()
    .min(1, { message: 'La fecha es obligatoria' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'La fecha no es válida' }),
  tipo: z.string().refine(
    (val) => ['Ingreso', 'Gasto'].includes(val),
    { message: 'El tipo de transacción no es válido' }
  ),
  concepto: z.string()
    .min(1, { message: 'El concepto es obligatorio' })
    .max(100, { message: 'El concepto no puede exceder 100 caracteres' }),
  monto: z.coerce.string()
    .min(1, { message: 'El monto es obligatorio' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'El monto debe ser un número positivo con hasta 2 decimales' })
    .refine((val) => parseFloat(val) > 0, { message: 'El monto debe ser mayor a 0' }),
  id_obra: z.coerce.string()
    .regex(/^\d+$/, { message: 'La obra seleccionada no es válida' })
    .optional()
    .nullable()
});

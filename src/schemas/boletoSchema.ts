import { z } from 'zod';

export const boletoSchema = z.object({
  id_usuario: z.coerce.string()
    .min(1, { message: 'El usuario es obligatorio' })
    .regex(/^\d+$/, { message: 'El ID de usuario debe ser un número positivo' }),
  id_asiento: z.coerce.string()
    .min(1, { message: 'El asiento es obligatorio' })
    .regex(/^\d+$/, { message: 'El ID de asiento debe ser un número positivo' }),
  id_obra: z.coerce.string()
    .min(1, { message: 'La obra es obligatoria' })
    .regex(/^\d+$/, { message: 'El ID de obra debe ser un número positivo' }),
  precio: z.coerce.string()
    .min(1, { message: 'El precio es obligatorio' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'El precio debe ser un número decimal válido (ej. 150.00)' }),
  fecha_compra: z.string()
    .min(1, { message: 'La fecha de compra es obligatoria' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'La fecha de compra no es válida' }),
  estado: z.string().refine(
    (val) => ['Reservado', 'Pagado', 'Cancelado'].includes(val),
    { message: 'El estado del boleto no es válido' }
  ).nullable().optional()
});

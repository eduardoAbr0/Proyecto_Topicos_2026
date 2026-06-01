import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { agregarBoleto } from '@/backend/models/ModelBoletos';
import { boletoSchema } from '@/schemas/boletoSchema';

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const tieneSesion = cookieStore.has('sesion_activa');

        if (!tieneSesion) {
            return NextResponse.json({ status: "error", message: "Debe iniciar sesión para comprar boletos" }, { status: 401 });
        }

        const idUsuario = Number(cookieStore.get('sesion_activa').value);
        const data = await request.json();
        
        if (!data) {
            return NextResponse.json({ status: "error", message: "Todos los campos son obligatorios" }, { status: 400 });
        }

        const datosBoleto = {
            id_usuario: idUsuario,
            id_asiento: data.id_asiento === '' ? null : data.id_asiento,
            id_obra: data.id_obra === '' ? null : data.id_obra,
            precio: data.precio === '' ? null : data.precio,
            fecha_compra: new Date().toISOString().split('T')[0],
            estado: data.estado === '' ? null : data.estado
        };

        const validacion = boletoSchema.safeParse(datosBoleto);
        if (!validacion.success) {
            const errores = validacion.error.issues.map(e => e.message).join(', ');
            return NextResponse.json({ status: "error", message: `Error de validación: ${errores}` }, { status: 400 });
        }

        const nuevoId = await agregarBoleto(validacion.data);
        return NextResponse.json({ status: "exito", message: "Boleto comprado con éxito", id: nuevoId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

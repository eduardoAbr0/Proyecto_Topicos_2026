import { NextResponse } from 'next/server';
import {
    mostrarBoletos,
    agregarBoleto,
    cambioBoleto,
    eliminarBoleto,
    mostrarBoletoDetalle
} from '@/backend/models/ModelBoletos';
import { boletoSchema } from '@/schemas/boletoSchema';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id_boleto');

        if (id) {
            const boleto = await mostrarBoletoDetalle(id);
            if (!boleto) return NextResponse.json({ error: 'Boleto no encontrado' }, { status: 404 });
            return NextResponse.json(boleto, { status: 200 });
        }

        const boletos = await mostrarBoletos();
        return NextResponse.json(boletos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const datosBoleto = {
            id_usuario: formData.get('formUsuario') === '' ? null : formData.get('formUsuario'),
            id_asiento: formData.get('formAsiento') === '' ? null : formData.get('formAsiento'),
            id_obra: formData.get('formObra') === '' ? null : formData.get('formObra'),
            precio: formData.get('formPrecio') === '' ? null : formData.get('formPrecio'),
            fecha_compra: formData.get('formFechaCompra') === '' ? null : formData.get('formFechaCompra'),
            estado: formData.get('formEstado') === '' ? null : formData.get('formEstado'),
        };

        const validacion = boletoSchema.safeParse(datosBoleto);
        if (!validacion.success) {
            const errores = validacion.error.issues.map(e => e.message).join(', ');
            return NextResponse.json({ status: "error", message: `Error de validación: ${errores}` }, { status: 400 });
        }

        const nuevoId = await agregarBoleto(validacion.data);
        return NextResponse.json({ status: "exito", message: "Boleto agregado con exito", id: nuevoId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const datosRaw = await request.json();
        const id = datosRaw.formId;

        const datosBoleto = {
            id_usuario: datosRaw.formUsuarioModificar === '' ? null : datosRaw.formUsuarioModificar,
            id_asiento: datosRaw.formAsientoModificar === '' ? null : datosRaw.formAsientoModificar,
            id_obra: datosRaw.formObraModificar === '' ? null : datosRaw.formObraModificar,
            precio: datosRaw.formPrecioModificar === '' ? null : datosRaw.formPrecioModificar,
            fecha_compra: datosRaw.formFechaCompraModificar === '' ? null : datosRaw.formFechaCompraModificar,
            estado: datosRaw.formEstadoModificar === '' ? null : datosRaw.formEstadoModificar,
        };

        const validacion = boletoSchema.safeParse(datosBoleto);
        if (!validacion.success) {
            const errores = validacion.error.issues.map(e => e.message).join(', ');
            return NextResponse.json({ status: "error", message: `Error de validación: ${errores}` }, { status: 400 });
        }

        await cambioBoleto(id, validacion.data);
        return NextResponse.json({ status: "exito", message: "Boleto modificado con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id_boleto } = await request.json();
        await eliminarBoleto(id_boleto);
        return NextResponse.json({ status: "exito", message: "Boleto eliminado con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
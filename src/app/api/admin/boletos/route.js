import { NextResponse } from 'next/server';
import {
    mostrarBoletos,
    agregarBoleto,
    cambioBoleto,
    eliminarBoleto,
    mostrarBoletoDetalle
} from '@/backend/models/ModelBoletos';

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
            id_usuario: formData.get('formUsuario'),
            id_asiento: formData.get('formAsiento'),
            id_obra: formData.get('formObra'),
            precio: formData.get('formPrecio'),
            fecha_compra: formData.get('formFechaCompra'),
            estado: formData.get('formEstado'),
        };

        const nuevoId = await agregarBoleto(datosBoleto);
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
            id_usuario: datosRaw.formUsuarioModificar,
            id_asiento: datosRaw.formAsientoModificar,
            id_obra: datosRaw.formObraModificar,
            precio: datosRaw.formPrecioModificar,
            fecha_compra: datosRaw.formFechaCompraModificar,
            estado: datosRaw.formEstadoModificar,
        };

        await cambioBoleto(id, datosBoleto);
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
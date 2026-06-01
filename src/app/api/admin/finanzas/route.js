import { NextResponse } from 'next/server';
import {
    mostrarFinanzas,
    agregarFinanza,
    cambioFinanza,
    eliminarFinanza,
    mostrarFinanzaDetalle
} from '@/backend/models/ModelFinanzas';
import { finanzaSchema } from '@/schemas/finanzaSchema';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id_finanza');

        if (id) {
            const finanza = await mostrarFinanzaDetalle(id);
            if (!finanza) return NextResponse.json({ error: 'Registro financiero no encontrado' }, { status: 404 });
            return NextResponse.json(finanza, { status: 200 });
        }

        const finanzas = await mostrarFinanzas();
        return NextResponse.json(finanzas, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const datosFinanza = {
            fecha: formData.get('formFecha'),
            tipo: formData.get('formTipo'),
            concepto: formData.get('formConcepto'),
            monto: formData.get('formMonto'),
            id_obra: formData.get('formObra') === '' ? null : formData.get('formObra'),
        };

        const validacion = finanzaSchema.safeParse(datosFinanza);
        if (!validacion.success) {
            const errores = validacion.error.issues.map(e => e.message).join(', ');
            return NextResponse.json({ status: "error", message: `Error de validación: ${errores}` }, { status: 400 });
        }

        const nuevoId = await agregarFinanza(validacion.data);
        return NextResponse.json({ status: "exito", message: "Registro financiero agregado con exito", id: nuevoId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const datosRaw = await request.json();
        const id = datosRaw.formId;

        const datosFinanza = {
            fecha: datosRaw.formFechaModificar,
            tipo: datosRaw.formTipoModificar,
            concepto: datosRaw.formConceptoModificar,
            monto: datosRaw.formMontoModificar,
            id_obra: datosRaw.formObraModificar === '' ? null : datosRaw.formObraModificar,
        };

        console.log('DATOS ACTUALIZAR EN API FINANZAS> ', datosFinanza);

        const validacion = finanzaSchema.safeParse(datosFinanza);
        if (!validacion.success) {
            const errores = validacion.error.issues.map(e => e.message).join(', ');
            return NextResponse.json({ status: "error", message: `Error de validación: ${errores}` }, { status: 400 });
        }

        await cambioFinanza(id, validacion.data);
        return NextResponse.json({ status: "exito", message: "Registro financiero modificado con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id_finanza } = await request.json();
        await eliminarFinanza(id_finanza);
        return NextResponse.json({ status: "exito", message: "Registro financiero eliminado con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

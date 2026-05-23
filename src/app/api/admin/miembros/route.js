import { NextResponse } from 'next/server';
import {
    mostrarMiembros,
    agregarMiembro,
    cambioMiembro,
    eliminarMiembro,
    mostrarMiembroDetalle
} from '@/backend/models/ModelMiembros';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id_miembro');

        if (id) {
            const miembro = await mostrarMiembroDetalle(id);
            if (!miembro) return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });
            return NextResponse.json(miembro, { status: 200 });
        }

        const miembros = await mostrarMiembros();
        return NextResponse.json(miembros, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const datosMiembro = {
            nombre: formData.get('formNombre'),
            primer_apellido: formData.get('formPrimerAp'),
            segundo_apellido: formData.get('formSegundoAp'),
            telefono: formData.get('formTelefono'),
            email: formData.get('formEmail'),
            numero_casa: formData.get('formNumCasa'),
            calle: formData.get('formCalle'),
            colonia: formData.get('formColonia'),
            cp: formData.get('formCP'),
            estado_membresia: formData.get('formEstadoMembresia'),
            fecha_pago_cuota: formData.get('formFechaPago'),
        };

        const nuevoId = await agregarMiembro(datosMiembro);
        return NextResponse.json({ status: "exito", message: "Miembro agregado con exito", id: nuevoId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const datosRaw = await request.json();
        const id = datosRaw.formId;

        const datosMiembro = {
            nombre: datosRaw.formNombreModificar,
            primer_apellido: datosRaw.formPrimerApModificar,
            segundo_apellido: datosRaw.formSegundoApModificar,
            telefono: datosRaw.formTelefonoModificar,
            email: datosRaw.formEmailModificar,
            numero_casa: datosRaw.formNumCasaModificar,
            calle: datosRaw.formCalleModificar,
            colonia: datosRaw.formColoniaModificar,
            cp: datosRaw.formCPModificar,
            estado_membresia: datosRaw.formEstadoMembresiaModificar,
            fecha_pago_cuota: datosRaw.formFechaPagoModificar,
        };

        await cambioMiembro(id, datosMiembro);
        return NextResponse.json({ status: "exito", message: "Miembro modificado con eexito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id_miembro } = await request.json();
        await eliminarMiembro(id_miembro);
        return NextResponse.json({ status: "exito", message: "Miembro eliminado con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
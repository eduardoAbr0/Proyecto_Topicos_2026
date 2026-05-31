import { NextResponse } from 'next/server';
import {
    mostrarObras,
    agregarObra,
    cambioObra,
    eliminarObra,
    mostrarObraDetalle
} from '@/backend/models/ModelObras';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id_obra');

        if (id) {
            const obra = await mostrarObraDetalle(id);
            if (!obra) return NextResponse.json({ error: 'Obra no encontrada' }, { status: 404 });
            return NextResponse.json(obra, { status: 200 });
        }

        const obras = await mostrarObras();
        return NextResponse.json(obras, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const datosObra = {
            titulo: formData.get('formTitulo'),
            autor: formData.get('formAutor'),
            tipo: formData.get('formTipo'),
            num_actos: formData.get('formNumActos'),
            anio_presentacion: formData.get('formAnioPresentacion'),
            temporada: formData.get('formTemporada'),
            productor: formData.get('formProductor'),
            descripcion: formData.get('formDescripcion'),
        };

        const nuevoId = await agregarObra(datosObra);
        return NextResponse.json({ status: "exito", message: "Obra agregada con exito", id: nuevoId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const datosRaw = await request.json();
        const id = datosRaw.formId;

        const datosObra = {
            titulo: datosRaw.formTituloModificar,
            autor: datosRaw.formAutorModificar,
            tipo: datosRaw.formTipoModificar,
            num_actos: datosRaw.formNumActosModificar,
            anio_presentacion: datosRaw.formAnioPresentacionModificar,
            temporada: datosRaw.formTemporadaModificar,
            productor: datosRaw.formProductorModificar,
            descripcion: datosRaw.formDescripcionModificar,
        };

                console.log('DATOS ACTUALIZAR EN API> ', datosObra);

        await cambioObra(id, datosObra);
        return NextResponse.json({ status: "exito", message: "Obra modificada con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id_obra } = await request.json();
        await eliminarObra(id_obra);
        return NextResponse.json({ status: "exito", message: "Obra eliminada con exito" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

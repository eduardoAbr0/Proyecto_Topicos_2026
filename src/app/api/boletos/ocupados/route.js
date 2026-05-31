import { NextResponse } from 'next/server';
import { obtenerAsientosOcupados } from '@/backend/models/ModelBoletos';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const idObra = searchParams.get('id_obra');

        if (!idObra) {
            return NextResponse.json({ status: "error", message: "Falta id de obra" }, { status: 400 });
        }

        const asientosOcupados = await obtenerAsientosOcupados(Number(idObra));
        return NextResponse.json({ status: "exito", asientosOcupados }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { mostrarUsuarios } from '@/backend/models/ModelUsuarios';

export async function GET(request) {
    try {
        const usuarios = await mostrarUsuarios();
        return NextResponse.json(usuarios, { status: 200 });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}

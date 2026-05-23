import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ 
            status: "exito", 
            message: "Sesión cerrada correctamente" 
        });

        response.cookies.delete('sesion_activa');

        return response;
    } catch (error) {
        return NextResponse.json({ 
            status: "error", 
            message: "No se pudo cerrar la sesión" 
        }, { status: 500 });
    }
}
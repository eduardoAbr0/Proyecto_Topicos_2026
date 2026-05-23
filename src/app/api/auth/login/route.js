import { NextResponse } from 'next/server';
import { obtenerUsuarioPorUsername } from '@/backend/models/ModelUsuarios';
import bcrypt from 'bcryptjs'; 

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const usuario = await obtenerUsuarioPorUsername(username);

        if (!usuario) {
            return NextResponse.json({ status: "error", message: "Usuario o contraseña incorrectos" }, { status: 401 });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.passw);

        if (!passwordCorrecto) {
            return NextResponse.json({ status: "error", message: "Usuario o contraseña incorrectos" }, { status: 401 });
        }

        const response = NextResponse.json({ 
            status: "exito", 
            message: "Bienvenido!",
            usuario: { nombre: usuario.nombre, email: usuario.email } 
        });

        response.cookies.set({
            name: 'sesion_activa',
            value: String(usuario.id_usuario),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 5
        });

        return response;

    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
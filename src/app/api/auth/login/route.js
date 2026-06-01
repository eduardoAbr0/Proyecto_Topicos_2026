import { NextResponse } from 'next/server';
import { obtenerUsuarioPorUsername } from '@/backend/models/ModelUsuarios';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { username, password, turnstileToken } = await request.json();

        const turnstileValidation = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: process.env.CLOUDFLARE_SECRET_KEY,
                response: turnstileToken,
            }),
        });

        const turnstileData = await turnstileValidation.json();

        if (!turnstileData.success) {
            return NextResponse.json(
                { status: "error", message: "Validación de captcha fallida" },
                { status: 400 }
            );
        }

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
            usuario: { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });

        response.cookies.set({
            name: 'sesion_activa',
            value: String(usuario.id_usuario),
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 5 * 10
        });

        response.cookies.set({
            name: 'user_role',
            value: usuario.rol ? usuario.rol : 'Cliente',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 5 * 10
        });

        return response;

    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
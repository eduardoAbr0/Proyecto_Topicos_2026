import { NextResponse } from 'next/server';
import { crearUsuario, obtenerUsuarioPorUsername } from '@/backend/models/ModelUsuarios';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { nombre, email, username, password } = await request.json();

        const usuarioExistente = await obtenerUsuarioPorUsername(username);
        if (usuarioExistente) {
            return NextResponse.json({ status: "error", message: "El nombre de usuario ya está en uso" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwEncriptada = await bcrypt.hash(password, salt);

        const nuevoUsuario = {
            username,
            passw: passwEncriptada,
            nombre,
            email
        };

        await crearUsuario(nuevoUsuario);

        return NextResponse.json({ status: "exito", message: "Usuario registrado correctamente" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
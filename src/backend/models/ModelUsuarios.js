import { query } from '@/backend/db'; 

export async function obtenerUsuarioPorUsername(username) {
    const sql = "SELECT id_usuario, username, passw, nombre, email FROM Usuarios WHERE username = ?";
    const filas = await query(sql, [username]);
    
    return filas.length > 0 ? filas[0] : null;
}

export async function crearUsuario(usuario) {
    const sql = `
        INSERT INTO Usuarios (username, passw, nombre, email)
        VALUES (?, ?, ?, ?)
    `;
    const params = [
        usuario.username,
        usuario.passw,
        usuario.nombre,
        usuario.email
    ];

    const resultado = await query(sql, params);
    return resultado.insertId; 
}

export async function obtenerUsuarioPorId(id) {
    const sql = "SELECT id_usuario, username, nombre, email FROM Usuarios WHERE id_usuario = ?";
    const filas = await query(sql, [id]);
    return filas.length > 0 ? filas[0] : null;
}
import { query } from '@/backend/db';

export async function agregarMiembro(miembro) {
    const sql = `
    INSERT INTO Miembros 
    (nombre, primer_apellido, segundo_apellido, telefono, email, numero_casa, calle, colonia, cp, estado_membresia, fecha_pago_cuota)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const fechaPago = miembro.fecha_pago_cuota === '' ? null : miembro.fecha_pago_cuota;

    const params = [
        miembro.nombre,
        miembro.primer_apellido,
        miembro.segundo_apellido,
        miembro.telefono,
        miembro.email,
        miembro.numero_casa,
        miembro.calle,
        miembro.colonia,
        miembro.cp,
        miembro.estado_membresia,
        fechaPago
    ];

    const resultado = await query(sql, params);
    return resultado.insertId;
}

export async function cambioMiembro(id, miembro) {
    const sql = `
    UPDATE Miembros SET 
      nombre = ?, primer_apellido = ?, segundo_apellido = ?, telefono = ?, email = ?, 
      numero_casa = ?, calle = ?, colonia = ?, cp = ?, estado_membresia = ?, fecha_pago_cuota = ?
    WHERE id_miembro = ?
  `;

    const fechaPago = miembro.fecha_pago_cuota === '' ? null : miembro.fecha_pago_cuota;

    const params = [
        miembro.nombre,
        miembro.primer_apellido,
        miembro.segundo_apellido,
        miembro.telefono,
        miembro.email,
        miembro.numero_casa,
        miembro.calle,
        miembro.colonia,
        miembro.cp,
        miembro.estado_membresia,
        fechaPago,
        id
    ];

    const resultado = await query(sql, params);
    return resultado.affectedRows > 0;
}

export async function eliminarMiembro(id) {
    const sql = "DELETE FROM Miembros WHERE id_miembro = ?";
    const resultado = await query(sql, [id]);
    return resultado.affectedRows > 0;
}

// 4. CONSULTAS GENERALES (mostrarMiembros)
export async function mostrarMiembros() {
    const sql = "SELECT id_miembro, nombre, primer_apellido, segundo_apellido, estado_membresia FROM Miembros";
    const filas = await query(sql);
    return filas;
}

export async function mostrarMiembroDetalle(id) {
    const sql = "SELECT * FROM Miembros WHERE id_miembro = ?";
    const filas = await query(sql, [id]);

    return filas.length > 0 ? filas[0] : null;
}
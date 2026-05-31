import { query } from '@/backend/db';

// ALTAS
export async function agregarBoleto(boleto) {
    const sql = `
        INSERT INTO Boletos 
        (id_usuario, id_asiento, id_obra, precio, fecha_compra, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const estado = boleto.estado === '' || boleto.estado == null ? 'Reservado' : boleto.estado;

    const params = [
        boleto.id_usuario,
        boleto.id_asiento,
        boleto.id_obra,
        boleto.precio,
        boleto.fecha_compra,
        estado
    ];

    const resultado = await query(sql, params);
    return resultado.insertId;
}

// CAMBIOS
export async function cambioBoleto(id, boleto) {
    const sql = `
        UPDATE Boletos SET 
            id_usuario = ?, id_asiento = ?, id_obra = ?, 
            precio = ?, fecha_compra = ?, estado = ?
        WHERE id_boleto = ?
    `;

    const estado = boleto.estado === '' || boleto.estado == null ? 'Reservado' : boleto.estado;

    const params = [
        boleto.id_usuario,
        boleto.id_asiento,
        boleto.id_obra,
        boleto.precio,
        boleto.fecha_compra,
        estado,
        id
    ];

    const resultado = await query(sql, params);
    return resultado.affectedRows > 0;
}

// BAJAS 
export async function eliminarBoleto(id) {
    const sql = "DELETE FROM Boletos WHERE id_boleto = ?";
    const resultado = await query(sql, [id]);
    return resultado.affectedRows > 0;
}

// CONSULTAS GENERALES
export async function mostrarBoletos() {
    const sql = `
        SELECT 
            b.id_boleto, b.precio, b.fecha_compra, b.estado,
            b.id_usuario, b.id_obra, b.id_asiento,
            o.titulo AS titulo_obra,
            u.nombre AS nombre_usuario
        FROM Boletos b
        LEFT JOIN Obras o ON b.id_obra = o.id_obra
        LEFT JOIN Usuarios u ON b.id_usuario = u.id_usuario
    `;
    const filas = await query(sql);
    return filas;
}

// CONSULTAS DETALLE
export async function mostrarBoletoDetalle(id) {
    const sql = `
        SELECT 
            b.id_boleto, b.precio, b.fecha_compra, b.estado,
            b.id_usuario, b.id_obra, b.id_asiento,
            o.titulo AS titulo_obra,
            u.nombre AS nombre_usuario
        FROM Boletos b
        LEFT JOIN Obras o ON b.id_obra = o.id_obra
        LEFT JOIN Usuarios u ON b.id_usuario = u.id_usuario
        WHERE b.id_boleto = ?
    `;
    const filas = await query(sql, [id]);
    return filas.length > 0 ? filas[0] : null;
}
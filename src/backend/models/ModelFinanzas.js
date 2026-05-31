import { query } from '@/backend/db';

// ALTAS
export async function agregarFinanza(finanza) {
    const sql = `
        INSERT INTO Finanzas 
        (fecha, tipo, concepto, monto, id_obra)
        VALUES (?, ?, ?, ?, ?)
    `;

    const idObra = finanza.id_obra === '' || finanza.id_obra == null ? null : Number(finanza.id_obra);

    const params = [
        finanza.fecha,
        finanza.tipo,
        finanza.concepto || null,
        Number(finanza.monto),
        idObra
    ];

    const resultado = await query(sql, params);
    return resultado.insertId;
}

// CAMBIOS
export async function cambioFinanza(id, finanza) {
    const sql = `
        UPDATE Finanzas SET
            fecha = ?, tipo = ?, concepto = ?, monto = ?, id_obra = ?
        WHERE id_finanza = ?
    `;

    const idObra = finanza.id_obra === '' || finanza.id_obra == null ? null : finanza.id_obra;

    const params = [
        finanza.fecha,
        finanza.tipo,
        finanza.concepto || null,
        finanza.monto,
        idObra,
        id
    ];

    const resultado = await query(sql, params);
    return resultado.affectedRows > 0;
}

// BAJAS
export async function eliminarFinanza(id) {
    const sql = 'DELETE FROM Finanzas WHERE id_finanza = ?';
    const resultado = await query(sql, [id]);
    return resultado.affectedRows > 0;
}

// CONSULTAS GENERALES
export async function mostrarFinanzas() {
    const sql = `
        SELECT 
            f.id_finanza, f.fecha, f.tipo, f.concepto, f.monto, f.id_obra,
            o.titulo AS titulo_obra
        FROM Finanzas f
        LEFT JOIN Obras o ON f.id_obra = o.id_obra
    `;
    const filas = await query(sql);
    return filas;
}

// CONSULTAS DETALLE
export async function mostrarFinanzaDetalle(id) {
    const sql = `
        SELECT 
            f.id_finanza, f.fecha, f.tipo, f.concepto, f.monto, f.id_obra,
            o.titulo AS titulo_obra
        FROM Finanzas f
        LEFT JOIN Obras o ON f.id_obra = o.id_obra
        WHERE f.id_finanza = ?
    `;
    const filas = await query(sql, [id]);
    return filas.length > 0 ? filas[0] : null;
}

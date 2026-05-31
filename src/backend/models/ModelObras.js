import { query } from '@/backend/db';

//ALTAS
export async function agregarObra(obra) {
    const sql = `
        INSERT INTO Obras 
        (titulo, autor, tipo, num_actos, anio_presentacion, temporada, productor, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const numActos = obra.num_actos === '' || obra.num_actos == null ? null : Number(obra.num_actos);
    const anio = obra.anio_presentacion === '' || obra.anio_presentacion == null ? null : Number(obra.anio_presentacion);
    const productor = obra.productor === '' || obra.productor == null ? null : Number(obra.productor);

    const params = [
        obra.titulo,
        obra.autor || null,
        obra.tipo || null,
        numActos,
        anio,
        obra.temporada || null,
        productor,
        obra.descripcion || null
    ];

    const resultado = await query(sql, params);
    return resultado.insertId;
}

//CAMBIOS
export async function cambioObra(id, obra) {
    const sql = `
        UPDATE Obras SET
            titulo = ?, autor = ?, tipo = ?, num_actos = ?,
            anio_presentacion = ?, temporada = ?, productor = ?, descripcion = ?
        WHERE id_obra = ?
    `;

    const numActos = obra.num_actos === '' || obra.num_actos == null ? null : Number(obra.num_actos);
    const anio = obra.anio_presentacion === '' || obra.anio_presentacion == null ? null : Number(obra.anio_presentacion);
    const productor = obra.productor === '' || obra.productor == null ? null : Number(obra.productor);

    const params = [
        obra.titulo,
        obra.autor || null,
        obra.tipo || null,
        numActos,
        anio,
        obra.temporada || null,
        productor,
        obra.descripcion || null,
        id
    ];

    const resultado = await query(sql, params);
    return resultado.affectedRows > 0;
}

//BAJAS
export async function eliminarObra(id) {
    const sql = 'DELETE FROM Obras WHERE id_obra = ?';
    const resultado = await query(sql, [id]);
    return resultado.affectedRows > 0;
}

//CONSULTAS GENERALES
export async function mostrarObras() {
    const sql = `
        SELECT 
            o.id_obra, o.titulo, o.autor, o.tipo, o.num_actos, o.anio_presentacion, 
            o.temporada, o.productor, o.descripcion,
            TRIM(CONCAT_WS(' ', m.nombre, m.primer_apellido, m.segundo_apellido)) AS nombre_productor
        FROM Obras o
        LEFT JOIN Miembros m ON o.productor = m.id_miembro
        ORDER BY o.titulo
    `;
    const filas = await query(sql);
    return filas;
}

//CONSULTAS DETALLE
export async function mostrarObraDetalle(id) {
    const sql = `
        SELECT 
            o.id_obra, o.titulo, o.autor, o.tipo, o.num_actos, o.anio_presentacion, 
            o.temporada, o.productor, o.descripcion,
            TRIM(CONCAT_WS(' ', m.nombre, m.primer_apellido, m.segundo_apellido)) AS nombre_productor
        FROM Obras o
        LEFT JOIN Miembros m ON o.productor = m.id_miembro
        WHERE o.id_obra = ?
    `;
    const filas = await query(sql, [id]);
    return filas.length > 0 ? filas[0] : null;
}
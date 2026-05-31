const API_URL = '/api/admin/finanzas';

export const obtenerFinanzas = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const obtenerFinanzaPorId = async (id) => {
    const response = await fetch(`${API_URL}?id_finanza=${id}`);
    return await response.json();
};

export const crearFinanza = async (formData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
    });
    return await response.json();
};

export const actualizarFinanza = async (datos) => {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await response.json();
};

export const eliminarFinanza = async (id) => {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_finanza: id })
    });
    return await response.json();
};

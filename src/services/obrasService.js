const API_URL = '/api/admin/obras';

export const obtenerObras = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const obtenerObraPorId = async (id) => {
    const response = await fetch(`${API_URL}?id_obra=${id}`);
    return await response.json();
};

export const crearObra = async (formData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
    });
    return await response.json();
};

export const actualizarObra = async (datos) => {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await response.json();
};

export const eliminarObra = async (id) => {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_obra: id })
    });
    return await response.json();
};

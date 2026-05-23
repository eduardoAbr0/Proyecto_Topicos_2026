const API_URL = "/api/admin/miembros";

export const obtenerMiembros = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const obtenerMiembroPorId = async (id) => {
    const response = await fetch(`${API_URL}?id_miembro=${id}`);
    return await response.json();
};

export const crearMiembro = async (formData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const actualizarMiembro = async (datos) => {
    const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    return await response.json();
};

export const eliminarMiembro = async (id) => {
    const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_miembro: id }),
    });
    return await response.json();
};
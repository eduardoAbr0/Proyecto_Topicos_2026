const API_URL = "/api/admin/boletos";

export const obtenerBoletos = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const obtenerBoletoPorId = async (id) => {
    const response = await fetch(`${API_URL}?id_boleto=${id}`);
    return await response.json();
};

export const crearBoleto = async (formData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const actualizarBoleto = async (datos) => {
    const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    return await response.json();
};

export const eliminarBoleto = async (id) => {
    const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_boleto: id }),
    });
    return await response.json();
};
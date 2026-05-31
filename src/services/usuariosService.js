const API_URL = '/api/admin/usuarios';

export const obtenerUsuarios = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

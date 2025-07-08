import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const verificarCarritoParaLimpiar = async (clienteId: string) => {
    try {
        const response = await axios.get(`${API_URL}/carrito/verificar-limpieza/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error('Error al verificar carrito para limpieza:', error);
        return { limpiarCarrito: false, mensaje: 'Error al verificar' };
    }
};

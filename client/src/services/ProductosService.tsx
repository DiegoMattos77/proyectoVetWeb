import axios from "axios";
import { safeParse } from "valibot";
import { getProductos, ProductsSchema } from '../types/index';

// type ProductoData = {
//     [key: string]: FormDataEntryValue;
// };

const PRODUCTO_URL = `${import.meta.env.VITE_API_URL}/productos`;

export async function obtenerProductos(): Promise<getProductos[]> {
    try {

        const { data } = await axios.get(PRODUCTO_URL);
        const result = safeParse(ProductsSchema, data);

        if (result.success) {
            return result.output;
        } else {
            console.error('Errores de validación:', result.issues);
            throw new Error('La lista de productos no es válida');
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
}

export async function obtenerProductos() {

    const { data } = await axios.get(PRODUCTO_URL, { responseType: 'blob' }); // Solicita la imagen como blob
    return data;






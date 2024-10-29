import axios from "axios";
import { safeParse } from "valibot";
import { ProductsSchema } from '../types/index';


const PRODUCTO_URL = `${import.meta.env.VITE_API_URL}/productos`;

export async function obtenerProductos() {
    try {
        const { data } = await axios.get(PRODUCTO_URL);
        console.log("Datos recibidos:", data);

        const parsedData = data.map((producto: any) => ({
            ...producto,
            precio_venta: parseFloat(producto.precio_venta),
            precio_compra: parseFloat(producto.precio_compra),
        }));

        const result = safeParse(ProductsSchema, parsedData);
        if (result.success) {
            return result.output;
        } else {
            throw new Error('Error al listar los productos');
        }
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw error;
    }
}




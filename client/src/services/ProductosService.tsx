import axios from "axios";
import { safeParse } from "valibot";
import { ProductsSchema } from '../types/index';

const PRODUCTO_URL = `${import.meta.env.VITE_API_URL}/productos`;

export async function obtenerProductos(busqueda?: string, categoria?: string) {
    try {
        let url = PRODUCTO_URL;
        const params: string[] = [];
        if (busqueda) params.push(`busqueda=${encodeURIComponent(busqueda)}`);
        if (categoria) params.push(`categoria=${encodeURIComponent(categoria)}`);
        if (params.length) url += `?${params.join("&")}`;

        const { data } = await axios.get(url);

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

export async function obtenerProductoPorId(id: string | number) {
    try {
        const { data } = await axios.get(`${PRODUCTO_URL}/${id}`);
        // Si necesitas validar el producto con un schema, hazlo aquí
        return data;
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        throw error;
    }
}
import { safeParse } from "valibot"
import axios from 'axios'
import { ProductosSchema, Productos, ProductsSchema } from '../types/index'


type ProductoData = {
    [k: string]: FormDataEntryValue
}

export async function postProducto(data: ProductoData) {

    //Validamos si es la información que recibimos con valibot
    try {
        const result = safeParse(ProductosSchema, {
            descripcion: data.descripcion,
            precio_venta: +data.precio_venta,

        })
        if (result.success) {

            // usamos axios para mandar los datos a la API
            const url = `${import.meta.env.VITE_API_URL}/productos/`
            await axios.post(url, {

            })


        } else {
            throw new Error('Datos invalidos')
        }
    } catch (error) {
        console.log(error)
    }

}

export async function getProductos() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/productos/`
        const { data } = await axios(url)
        // console.log(data.data)
        const result = safeParse(ProductsSchema, data.data) // Utilizo el ProductsSchema por que lo convertimos a un array

        if (result.success) {

            return result.output
        } else {
            throw new Error('Hubo un error')
        }

    } catch (error) {
        console.log(error)
    }


}

export async function getByIdProductoId(id: Productos['id_producto']) {

    try {
        const url = `${import.meta.env.VITE_API_URL}/productos/${id}`
        const { data } = await axios(url)
        // console.log(data.data)
        const result = safeParse(ProductosSchema, data.data)
        if (result.success) {
            return result.output
        } else {
            throw new Error('Hubo un error')
        }

    } catch (error) {
        console.log(error)
    }

}
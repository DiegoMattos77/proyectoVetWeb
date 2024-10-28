import { object, string, number, InferOutput, blob, array } from 'valibot';

// Esquema de validación para el modelo Cliente
export const DrafClienteSchema = object({
    dni: string(),
    cuit_cuil: string(),
    nombre: string(),
    apellido: string(),
    domicilio: string(),
    telefono: string(),
    mail: string(),
    estado: string(),
    password: string()
});

export const ClienteSchema = object({
    id_cliente: number(),
    dni: string(),
    cuit_cuil: string(),
    nombre: string(),
    apellido: string(),
    domicilio: string(),
    telefono: string(),
    mail: string(),
    estado: string(),
    password: string()
});


export const LoginClienteSchema = object({
    mail: string(),
    password: string()
});


// Esquema de validación para el modelo Productos
export const getProductosSchema = object({
    id_producto: number(),
    descripcion: string(),
    id_proveedor: number(),
    id_categoria: number(),
    stock: number(),
    precio_venta: number(),
    precio_compra: number(),
    stock_seguridad: number(),
    estado: string(),
    imagen: object({
        id_imagen: number(),
        id_productos: number(),
        nombre_archivo: string(),
        ruta: string(),
        descripcion: string(),
        imagen_bin: blob()
    })
});

// // Esquema de validación para el modelo Imagenes
// export const getImagenesSchema = object({
//     id_imagen: number(),
//     id_productos: number(),
//     nombre_archivo: string(),
//     ruta: string(),
//     descripcion: string(),
//     imagen_bin: blob()
// });

// Inferir los tipos de salida de los esquemas
export type getProductos = InferOutput<typeof getProductosSchema>;
//export type getImagenes = InferOutput<typeof getImagenesSchema>;
export type ClienteCompleto = InferOutput<typeof ClienteSchema>;
export type Cliente = InferOutput<typeof DrafClienteSchema>;
export type LoginCliente = InferOutput<typeof LoginClienteSchema>;



export const ProductsSchema = array(getProductosSchema);
export const ClientesSchema = array(ClienteSchema);
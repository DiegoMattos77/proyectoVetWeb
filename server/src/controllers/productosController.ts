import { Request, Response } from "express";
import Productos from "../models/Productos.models";
import Imagenes from "../models/Imagenes.models";

// Función para convertir Blob a Base64
const convertBlobToBase64 = (blob: Buffer): string => {
    return blob.toString('base64');

};

export const getProducto = async (_req: Request, res: Response) => {
    try {
        const productos = await Productos.findAll({
            include: [Imagenes],
        });

        const productosConImagenes = productos.map((producto) => {
            const productoJSON = producto.toJSON();

            if (producto.imagen?.imagen_bin) {
                productoJSON.imagen = convertBlobToBase64(
                    producto.imagen.imagen_bin as unknown as Buffer
                );
            }

            return productoJSON;
        });

        res.status(200).json(productosConImagenes);
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).json({ error: error.message });
    }
};

// export const getProducto = async (_req: Request, res: Response) => {
//     try {
//         const productos = await Productos.findAll({
//             attributes: ['id_producto', 'descripcion', 'id_proveedor', 'id_categoria', 'stock', 'stock_seguridad', 'estado', 'precio_compra', 'precio_venta', 'imagen']
//         });

//         // No se agregaron los atributos: imagen

//         res.status(200).json(productos);
//     } catch (error) {
//         console.error('Error al obtener productos', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// Obtener un producto por su ID (incluyendo la imagen en Base64)
export const getProductoById = async (req: Request, res: Response) => {
    try {
        const producto = await Productos.findByPk(req.params.id, {
            include: [Imagenes], // Incluir la imagen relacionada
        });

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        // Convertir imagen a Base64
        const productoConImagen = {
            ...producto.toJSON(),
            imagen: producto.imagen ? convertBlobToBase64(producto.imagen.imagen_bin as unknown as Buffer) : null, // Convierte la imagen a Base64
        };

        return res.json(productoConImagen);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al obtener el producto' });
    }
};



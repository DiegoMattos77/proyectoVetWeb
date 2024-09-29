import { Request, Response } from "express";
import Productos from "../models/Productos.models";
import Imagenes from "../models/Imagenes.models";

// Función para convertir Blob a Base64
const convertBlobToBase64 = (blob: Buffer): string => {
    return blob.toString('base64'); // Asegúrate de que esto sea un Buffer
};

// Obtener todos los productos (incluyendo sus imágenes en Base64)
export const getProducto = async (_req: Request, res: Response) => {
    try {
        const productos = await Productos.findAll({
            include: [Imagenes], // Incluir las imágenes relacionadas
        });

        // Convertir imágenes a Base64
        const productosConImagenes = productos.map((producto) => {
            if (producto.imagen) {
                return {
                    ...producto.toJSON(), // Convierte el producto a JSON
                    imagen: convertBlobToBase64(producto.imagen.imagen_bin as unknown as Buffer), // Convierte la imagen a Base64
                };
            }
            return producto.toJSON();
        });

        res.status(200).json(productosConImagenes);
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).json({ error: error.message });
    }
};

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



import { Request, Response } from "express";
import { Op } from "sequelize";
import Productos from "../models/Productos.models";
import Imagenes from "../models/Imagenes.models";

// Función para convertir Blob a Base64
const convertBlobToBase64 = (blob: Buffer): string => {
    return blob.toString('base64');
};

export const getProducto = async (req: Request, res: Response) => {
    try {
        const { busqueda, categoria, nombre_categoria } = req.query;

        // Construir el filtro de búsqueda si hay parámetro
        const where: any = {};
        if (busqueda) {
            const palabras = (busqueda as string).split(" ");
            where[Op.and] = palabras.map(palabra => ({
                [Op.or]: [
                    { descripcion: { [Op.like]: `%${palabra}%` } },
                    // { marca: { [Op.like]: `%${palabra}%` } },
                    // { categoria: { [Op.like]: `%${palabra}%` } }
                ]
            }));
        }

        // Filtrar por categoría si viene en la query
        if (categoria) {
            // Cambia 'categoria' por el nombre real del campo en tu modelo, por ejemplo 'id_categoria' o 'categoria'
            where.id_categoria = categoria;
        }

        const productos = await Productos.findAll({
            where,
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



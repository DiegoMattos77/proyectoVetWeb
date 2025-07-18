import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import Productos from "../models/Productos.models";
import Imagenes from "../models/Imagenes.models";

// Función para convertir Blob a Base64
const convertBlobToBase64 = (blob: Buffer): string => {
    return blob.toString('base64');
};

export const getProducto = async (req: Request, res: Response) => {
    try {
        const { busqueda, categoria } = req.query;

        // Construir el filtro de búsqueda si hay parámetro
        const where: any = {};

        // Filtrar productos cuyo stock sea mayor al stock de seguridad
        where.stock = { [Op.gt]: Sequelize.col('stock_seguridad') };

        if (busqueda) {
            const palabras = (busqueda as string).split(" ");
            where[Op.and] = [
                ...(where[Op.and] || []),
                ...palabras.map(palabra => ({
                    [Op.or]: [
                        { descripcion: { [Op.like]: `%${palabra}%` } },
                        // { marca: { [Op.like]: `%${palabra}%` } },
                        // { categoria: { [Op.like]: `%${palabra}%` } }
                    ]
                }))
            ];
        }

        // Filtrar por categoría si viene en la query
        if (categoria) {
            where.id_categoria = categoria;
        }

        const productos = await Productos.findAll({
            where,
            include: [Imagenes],
        });

        const productosConImagenes = productos.map((producto) => {
            const productoJSON = producto.toJSON();

            // Si la imagen viene como objeto, conviértela a base64
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

export const getProductoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const producto = await Productos.findByPk(id, { include: [Imagenes] });
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Validar stock mayor a stock_seguridad
        if (producto.stock <= producto.stock_seguridad) {
            return res.status(404).json({ error: "Producto no disponible" });
        }

        const productoJSON = producto.toJSON();
        if (producto.imagen?.imagen_bin) {
            productoJSON.imagen = convertBlobToBase64(
                producto.imagen.imagen_bin as unknown as Buffer
            );
        } else {
            productoJSON.imagen = "";
        }

        res.json(productoJSON);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto por ID" });
    }
};

// Función para verificar stock disponible
export const verificarStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const producto = await Productos.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Verificar si el producto tiene stock disponible (mayor a stock de seguridad)
        const stockDisponible = producto.stock > producto.stock_seguridad;

        res.json({
            id_producto: producto.id_producto,
            descripcion: producto.descripcion,
            stock_actual: producto.stock,
            stock_seguridad: producto.stock_seguridad,
            stock_disponible: stockDisponible,
            cantidad_disponible: Math.max(0, producto.stock - producto.stock_seguridad)
        });
    } catch (error) {
        console.error('Error al verificar stock:', error);
        res.status(500).json({ error: "Error al verificar el stock del producto" });
    }
};

// Función para actualizar stock (para uso administrativo)
export const actualizarStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nuevo_stock } = req.body;

        if (typeof nuevo_stock !== 'number' || nuevo_stock < 0) {
            return res.status(400).json({ error: "El nuevo stock debe ser un número positivo" });
        }

        const producto = await Productos.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const stockAnterior = producto.stock;
        await producto.update({ stock: nuevo_stock });

        res.json({
            mensaje: "Stock actualizado correctamente",
            producto: producto.descripcion,
            stock_anterior: stockAnterior,
            stock_nuevo: nuevo_stock
        });
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({ error: "Error al actualizar el stock del producto" });
    }
};
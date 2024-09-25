import { Request, Response } from "express";
import productos from "../models/Productos.models";

//Creo un nuevo producto
// export const createProducto = async (req: Request, res: Response) => {
//     try {
//         const producto = await productos.create(req.body);
//         res.status(201).json(producto);
//     } catch (error) {
//         console.error('Error al crear un productos', error);
//         res.status(500).json({ error: error.messaje });
//     }
// };

//Obtengo todos los producto
export const getProducto = async (req: Request, res: Response) => {
    try {
        const producto = await productos.findAll();
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Obtengo un producto por su id
export const getProductoById = async (req: Request, res: Response) => {
    try {
        const producto = await productos.findByPk(req.params.id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ error: "No se encontraron productos" });
        }
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Actualizo un producto
export const updateProducto = async (req: Request, res: Response) => {
    try {
        const producto = await productos.findByPk(req.params.id);
        if (producto) {
            await producto.update(req.body);
            res.status(200).json(producto);
        } else {
            res.status(404).json({ error: "No se encontraron productos para modificar" });
        }
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Elimino un producto
// export const deleteProducto = async (req: Request, res: Response) => {
//     try {
//         const deleted = await productos.destroy({
//             where: { id_producto: req.params.id }
//         });
//         if (deleted) {
//             res.status(204).send();
//         } else {
//             res.status(404).json({ error: "No se encontraron productos para eliminar" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };

import { Request, Response } from "express";
import pedidos from "../models/Pedidos.models";

//Creo un nuevo pedido
export const createPedido = async (req: Request, res: Response) => {
    try {
        const pedido = await pedidos.create(req.body);
        res.status(201).json(pedido);
    } catch (error) {
        console.error('Error al crear un pedido', error);
        res.status(500).json({ error: error.messaje });
    }
};

//Obtengo todos los pedidos
// export const getPedido = async (req: Request, res: Response) => {
//     try {
//         const pedido = await pedidos.findAll();
//         res.status(200).json(pedido);
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };

//Obtengo un pedido por su id
// export const getPedidoById = async (req: Request, res: Response) => {
//     try {
//         const pedido = await pedidos.findByPk(req.params.id);
//         if (pedido) {
//             res.status(200).json(pedido);
//         } else {
//             res.status(404).json({ error: "No se encontraron pedidos" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };

//Actualizo un pedido
// export const updatePedido = async (req: Request, res: Response) => {
//     try {
//         const pedido = await pedidos.findByPk(req.params.id);
//         if (pedido) {
//             await pedido.update(req.body);
//             res.status(200).json(pedido);
//         } else {
//             res.status(404).json({ error: "No se encontraron pedidos para modificar" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };

//Elimino un pedido
// export const deletePedido = async (req: Request, res: Response) => {
//     try {
//         const deleted = await pedido.destroy({
//             where: { id_pedido: req.params.id }
//         });
//         if (deleted) {
//             res.status(204).send();
//         } else {
//             res.status(404).json({ error: "No se encontraron pedidos para eliminar" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };


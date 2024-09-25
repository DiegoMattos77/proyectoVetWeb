import { Request, Response } from "express";
import DetallePedidos from "../models/DetallePedidos.models";

//Creo un nuevo detalle de pedido
export const createDetallePedido = async (req: Request, res: Response) => {
    try {
        const detalle = await DetallePedidos.create(req.body);
        res.status(201).json(detalle);
    } catch (error) {
        console.error('Error al crear un detalle de pedidos', error);
        res.status(500).json({ error: error.messaje });
    }
};

//get detalles
// export const getDetallePedido = async (_: Request, res: Response) => {
//     try {
//         const detalle = await DetallePedidos.findAll();
//         res.status(200).json(detalle);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

//detalle por id
// export const getClientById = async (req: Request, res: Response) => {
//     try {
//         const detalle = await DetallePedidos.findByPk(req.params.id);
//         if (detalle) {
//             res.status(200).json(detalle);
//         } else {
//             res.status(404).json({ error: "No se encontraron detalles" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };
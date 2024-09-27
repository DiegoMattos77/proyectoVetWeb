import { Request, Response } from "express";
import pedidos from "../models/Pedidos.models";
import db from '../config/db';

// Creo un nuevo pedido
export const createPedido = async (req: Request, res: Response) => {
    try {
        // Usar transacción para evitar conflictos de concurrencia
        const nuevoPedido = await db.transaction(async (t) => {
            // Obtener el último id_pedido y bloquear la fila hasta que termine la transacción
            const ultimoPedido = await pedidos.findOne({
                order: [['id_pedido', 'DESC']],
                limit: 1,
                lock: t.LOCK.UPDATE,  // Bloquear para evitar lecturas concurrentes
                transaction: t
            });

            // Calcular el nuevo ID
            const nuevoId = ultimoPedido ? ultimoPedido.id_pedido + 1 : 1;
            const id_empleadoWeb = 4;  // ID del empleado de ventas web 

            // Crear el nuevo pedido con el nuevo ID
            const pedidoCreado = await pedidos.create({
                id_pedido: nuevoId,   // Asignar el nuevo ID calculado
                id_cliente: req.body.id_cliente,
                id_empleados: id_empleadoWeb,
                fecha_pedido: req.body.fecha_pedido,
                importe: req.body.importe

            }, { transaction: t });

            return pedidoCreado;
        });

        // Responder con éxito
        res.status(201).json(nuevoPedido);

    } catch (error) {
        console.error('Error al crear un pedido', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtengo todos los pedidos
export const getPedido = async (req: Request, res: Response) => {
    try {
        const pedido = await pedidos.findAll();
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener pedidos', error);
        res.status(500).json({ error: error.message });
    }
};

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


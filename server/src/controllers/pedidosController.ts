import { Request, Response } from "express";
import pedidos from "../models/Pedidos.models";
import { db } from '../config/db';

// Creo un nuevo pedido
export const createPedido = async (req: Request, res: Response) => {
    try {
        // Usar transacción para evitar conflictos de concurrencia
        const nuevoPedido = await db.transaction(async (t) => {
            const id_empleadoWeb = 4;  // ID del empleado de ventas web 

            // Crear el nuevo pedido - el ID se generará automáticamente
            const pedidoCreado = await pedidos.create({
                // NO asignar id_pedido - se genera automáticamente
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

// Obtener pedido por payment_id
export const getPedidoByPaymentId = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;
        console.log('🔍 Buscando pedido con payment_id:', paymentId);

        // Buscar pedido que tenga este payment_id en su campo payment_id
        const pedido = await pedidos.findOne({
            where: { payment_id: paymentId }
        });

        if (pedido) {
            console.log('✅ Pedido encontrado:', pedido.id_pedido);
            res.status(200).json(pedido);
        } else {
            console.log('❌ No se encontró pedido con payment_id:', paymentId);
            res.status(404).json({ error: "No se encontró pedido con ese payment_id" });
        }
    } catch (error) {
        console.error('Error al buscar pedido por payment_id:', error);
        res.status(500).json({ error: error.message });
    }
};


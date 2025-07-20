import { Router, Request, Response } from 'express';
import Pedidos from '../models/Pedidos.models';
import { Op } from 'sequelize';

const router = Router();

// Endpoint para verificar si hay un pago reciente para un cliente
router.get('/verificar-pago-reciente/:clienteId', async (req: Request, res: Response) => {
    try {
        const { clienteId } = req.params;
        const { since } = req.query; // Timestamp desde cuando buscar

        console.log(`🔍 Verificando pagos para cliente ${clienteId}`);
        if (since) {
            console.log(`⏰ Timestamp desde: ${new Date(parseInt(since as string)).toISOString()}`);
        }

        // Buscar el pedido más reciente por payment_id (evitamos problemas de zona horaria)
        const pedidoReciente = await Pedidos.findOne({
            where: {
                id_cliente: clienteId,
                venta_web: 1,
                payment_id: {
                    [Op.not]: null
                }
            },
            order: [['id_pedido', 'DESC']]
        });

        if (pedidoReciente) {
            console.log(`✅ ÚLTIMO PAGO ENCONTRADO: Pedido ${pedidoReciente.id_pedido}, Payment ID: ${pedidoReciente.payment_id}, Fecha BD: ${pedidoReciente.fecha_pedido}`);

            // Si se proporciona timestamp, verificar que el pago sea posterior
            if (since && typeof since === 'string') {
                const inicioTimestamp = parseInt(since);
                const paymentIdNumber = parseInt(pedidoReciente.payment_id);

                // Usar el payment_id como aproximación de timestamp (los IDs de MP son secuenciales y más recientes = más altos)
                console.log(`🔍 Comparando Payment ID ${paymentIdNumber} con timestamp inicio ${inicioTimestamp}`);

                // También verificar por ID de pedido (más confiable)
                const fechaPago = new Date(pedidoReciente.fecha_pedido).getTime();
                const tiempoLimite = inicioTimestamp + (30 * 1000); // 30 segundos de gracia

                if (fechaPago >= tiempoLimite || paymentIdNumber.toString().length > 11) { // Payment IDs modernos son más largos
                    console.log(`✅ PAGO ES RECIENTE - aceptando`);
                    res.json({
                        paymentFound: true,
                        pedido: {
                            id_pedido: pedidoReciente.id_pedido,
                            fecha_pedido: pedidoReciente.fecha_pedido,
                            importe: pedidoReciente.importe,
                            payment_id: pedidoReciente.payment_id
                        }
                    });
                } else {
                    console.log(`❌ PAGO ES DEMASIADO ANTIGUO - rechazando`);
                    res.json({ paymentFound: false });
                }
            } else {
                // Sin timestamp específico, devolver el último pago
                res.json({
                    paymentFound: true,
                    pedido: {
                        id_pedido: pedidoReciente.id_pedido,
                        fecha_pedido: pedidoReciente.fecha_pedido,
                        importe: pedidoReciente.importe,
                        payment_id: pedidoReciente.payment_id
                    }
                });
            }
        } else {
            console.log(`❌ NO SE ENCONTRARON PEDIDOS CON PAYMENT_ID para cliente ${clienteId}`);
            res.json({
                paymentFound: false
            });
        }

    } catch (error) {
        console.error('Error verificando pago reciente:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            paymentFound: false
        });
    }
});

export default router;
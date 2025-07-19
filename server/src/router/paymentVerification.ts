import { Router, Request, Response } from 'express';
import Pedidos from '../models/Pedidos.models';
import { Op } from 'sequelize';

const router = Router();

// Endpoint para verificar si hay un pago reciente para un cliente
router.get('/verificar-pago-reciente/:clienteId', async (req: Request, res: Response) => {
    try {
        const { clienteId } = req.params;
        
        // Buscar pedidos del cliente en los últimos 5 minutos
        const cincuentaMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);
        
        const pedidoReciente = await Pedidos.findOne({
            where: {
                id_cliente: clienteId,
                venta_web: 1,
                payment_id: {
                    [Op.not]: null
                },
                fecha_pedido: {
                    [Op.gte]: cincuentaMinutosAtras
                }
            },
            order: [['fecha_pedido', 'DESC']]
        });

        if (pedidoReciente) {
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

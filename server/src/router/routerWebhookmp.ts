import { Router } from 'express';
import axios from 'axios';
import { Productos } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/webhook', async (req, res) => {
    try {
        if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
            console.error("MERCADOPAGO_ACCESS_TOKEN no está definido");
            return res.sendStatus(500);
        }

        // Mercado Pago envía el id del pago en el body o query
        const paymentId = req.body.data?.id || req.query['data.id'];
        if (!paymentId) return res.sendStatus(400);

        // Consulta el pago a la API de Mercado Pago para obtener el metadata
        const mpResponse = await axios.get(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                },
            }
        );

        const payment = mpResponse.data;

        // Solo si el pago está aprobado
        if (payment.status === "approved") {
            const productos = payment.metadata?.productos;
            if (Array.isArray(productos)) {
                for (const prod of productos) {
                    if (typeof prod.id_producto !== 'undefined' && typeof prod.cantidad === 'number') {
                        await Productos.decrement('stock', {
                            by: prod.cantidad,
                            where: { id_producto: prod.id_producto }
                        });
                    }
                }
            }
        }

        res.sendStatus(200);
    } catch (error: any) {
        console.error("Error en webhook Mercado Pago:", error?.response?.data || error.message || error);
        res.sendStatus(500);
    }
});

export default router;
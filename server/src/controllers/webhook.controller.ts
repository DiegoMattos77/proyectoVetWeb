import { Request, Response, NextFunction } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { config } from '../config/db';
import crypto from 'crypto';
import { mercadopago } from '../config/mercadopago';

export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Webhook recibido:', JSON.stringify(req.body, null, 2));

        // 1. Verificar si es una notificación de prueba
        const isTestNotification = req.body.id === "123456" && req.body.live_mode === false;

        if (isTestNotification) {
            console.log('Notificación de prueba recibida - Respondiendo OK sin procesar');
            res.status(200).json({ status: 'OK', message: 'Test notification received' });
            return;
        }

        // 2. Verificar firma en producción
        if (process.env.NODE_ENV === 'production') {
            const signature = req.headers['x-signature'] as string;
            if (!signature) {
                console.warn('Intento de acceso no autorizado: firma no proporcionada');
                res.status(401).json({ error: 'Firma no proporcionada' });
                return;
            }

            const expectedSignature = crypto
                .createHmac('sha256', config.accessToken)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (signature !== `sha256=${expectedSignature}`) {
                console.warn('Intento de acceso no autorizado: firma inválida');
                res.status(401).json({ error: 'Firma inválida' });
                return;
            }
        }

        // 3. Extraer ID del pago
        const paymentId = req.body.id || req.body.data?.id;
        if (!paymentId) {
            console.error('ID de pago no encontrado en el webhook:', req.body);
            res.status(400).json({ error: 'ID de pago no proporcionado' });
            return;
        }

        console.log('Buscando pago con ID:', paymentId);

        // 4. Obtener datos del pago desde Mercado Pago
        try {
            const paymentData = await mercadopago.payments.get({ id: paymentId.toString() });
            console.log('Datos del pago recibidos:', paymentData);

            // 5. Manejar diferentes estados del pago
            switch (paymentData.status) {
                case 'approved':
                    console.log('Pago aprobado:', paymentData.id);
                    // Aquí guardar en tu base de datos
                    break;
                case 'pending':
                    console.log('Pago pendiente:', paymentData.id);
                    break;
                case 'rejected':
                    console.log('Pago rechazado:', paymentData.id);
                    break;
                default:
                    console.log('Estado desconocido:', paymentData.status);
            }

            // 6. Responder OK a Mercado Pago
            res.status(200).json({ status: 'OK' });
        } catch (error: any) {
            console.error('Error al obtener el pago de Mercado Pago:', error);

            // Manejar específicamente el error 404
            if (error.response?.status === 404) {
                res.status(200).json({
                    status: 'Warning',
                    message: 'Payment not found in Mercado Pago, but webhook processed'
                });
                return;
            }

            throw error; // Pasar otros errores al middleware
        }
    } catch (error) {
        console.error('Error procesando webhook:', error);
        next(error);
    }
};
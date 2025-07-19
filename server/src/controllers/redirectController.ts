import { Request, Response } from 'express';

export const handlePaymentRedirect = (req: Request, res: Response) => {
    const { status, collection_id, collection_status, payment_id, payment_type, merchant_order_id, preference_id, site_id, processing_mode, merchant_account_id } = req.query;

    console.log('🔄 Redirigiendo pago con parámetros:', req.query);

    if (status === 'success') {
        // Construir URL con todos los parámetros necesarios para la vista de confirmación
        const params = new URLSearchParams({
            status: 'success',
            ...(payment_id && { payment_id: payment_id.toString() }),
            ...(collection_id && { collection_id: collection_id.toString() }),
            ...(collection_status && { collection_status: collection_status.toString() }),
            ...(payment_type && { payment_type: payment_type.toString() }),
            ...(merchant_order_id && { merchant_order_id: merchant_order_id.toString() }),
            ...(preference_id && { preference_id: preference_id.toString() })
        });

        const redirectUrl = `http://localhost:5173/payment-confirmation?${params.toString()}`;
        console.log('✅ Redirigiendo a:', redirectUrl);
        return res.redirect(redirectUrl);
    } else if (status === 'failure') {
        const params = new URLSearchParams({
            status: 'failure',
            ...(payment_id && { payment_id: payment_id.toString() }),
            ...(collection_id && { collection_id: collection_id.toString() })
        });

        const redirectUrl = `http://localhost:5173/payment-confirmation?${params.toString()}`;
        console.log('❌ Redirigiendo a fallo:', redirectUrl);
        return res.redirect(redirectUrl);
    } else if (status === 'pending') {
        const params = new URLSearchParams({
            status: 'pending',
            ...(payment_id && { payment_id: payment_id.toString() }),
            ...(collection_id && { collection_id: collection_id.toString() })
        });

        const redirectUrl = `http://localhost:5173/payment-confirmation?${params.toString()}`;
        console.log('⏳ Redirigiendo a pendiente:', redirectUrl);
        return res.redirect(redirectUrl);
    } else {
        // Redirigir al frontend con un mensaje de error desconocido
        const redirectUrl = 'http://localhost:5173/payment-confirmation?status=unknown';
        console.log('❓ Redirigiendo a estado desconocido:', redirectUrl);
        return res.redirect(redirectUrl);
    }
};
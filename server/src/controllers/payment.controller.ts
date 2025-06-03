//controllers/payment.controller.ts
import { mercadopago } from '../config/mercadopago';
import { Request, Response } from 'express';


export const createMercadoPagoPreference = async (amount: number, method: string) => {
    try {
        const preference = await mercadopago.preferences.create({
            body: {  // <-- Agrega esta envoltura 'body'
                items: [
                    {
                        id: 'product-001',
                        title: 'Producto',
                        quantity: 1,
                        currency_id: 'ARS',
                        unit_price: amount,
                    },
                ],
                payment_methods: {
                    excluded_payment_types: [{ id: method }],
                },
                back_urls: {
                    success: 'http://localhost:5173/success',
                    failure: 'http://localhost:5173/failure',
                    pending: 'http://localhost:5173/pending',
                },
                auto_return: 'approved',
            }
        });

        return preference;
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        throw error;
    }
};

export const handlePaymentRedirect = (req: Request, res: Response) => {
    const { status } = req.query; // Leer el parámetro "status" de la URL

    if (status === 'success') {
        // Redirigir al frontend con el estado de éxito
        return res.redirect('http://localhost:5173/productos?message=success');
    } else if (status === 'failure') {
        // Redirigir al frontend con el estado de fallo
        return res.redirect('http://localhost:5173?message=failure');
    } else if (status === 'pending') {
        // Redirigir al frontend con el estado pendiente
        return res.redirect('http://localhost:5173?message=pending');
    } else {
        // Redirigir al frontend con un mensaje de error desconocido
        return res.redirect('http://localhost:5173?message=unknown');
    }
};

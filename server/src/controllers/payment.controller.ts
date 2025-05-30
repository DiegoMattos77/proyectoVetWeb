//controllers/payment.controller.ts
import { mercadopago } from '../config/mercadopago';

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
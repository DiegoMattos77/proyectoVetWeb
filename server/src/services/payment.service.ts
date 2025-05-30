// src/services/payment.service.ts
import mercadopago from '../config/mercadopago';

export const createMercadoPagoPreference = async (amount: number, method: string) => {
    const response = await mercadopago.preferences.create({
        body: {
            items: [
                {
                    id: 'item-1',
                    title: String(),
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: amount,
                },
            ],
            back_urls: {
                success: 'http://localhost:3000/success',
                failure: 'http://localhost:3000/failure',
                pending: 'http://localhost:3000/pending',
            },
            auto_return: 'approved',
        },
    });

    return response;
};
// src/config/mercadopago.ts
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { config } from './db';

const client = new MercadoPagoConfig({
    accessToken: config.accessToken,
    options: { timeout: 5000 } // Añade timeout para evitar esperas infinitas
});

export const mercadopago = {
    preferences: new Preference(client),
    payments: new Payment(client),
    client // Exportamos el cliente por si se necesita directamente
};

export default mercadopago;
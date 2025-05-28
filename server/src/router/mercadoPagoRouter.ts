import { Router } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está definido en el entorno");
}

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string });

router.post('/crear-preferencia', async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items inválidos" });
        }
        const preference = {
            items: items.map((item: any) => ({
                id: String(item.id_producto), // Agrega el campo id requerido
                title: item.descripcion,
                quantity: item.cantidad,
                currency_id: "ARS",
                unit_price: Number(item.precio_venta)
            })),
            metadata: {
                productos: items.map((item: any) => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad
                }))
            },
            back_urls: {
                success: "https://48c8-181-230-99-242.ngrok-free.app/api/webhookmp/webhook/success",
                failure: "https://48c8-181-230-99-242.ngrok-free.app/api/webhookmp/webhook/failure",
                pending: "https://48c8-181-230-99-242.ngrok-free.app/api/webhookmp/webhook/pending"
            },
            auto_return: "approved"
        };

        const preferenceClient = new Preference(client);
        const response = await preferenceClient.create({ body: preference });
        res.json({ id: response.id });
    } catch (error: any) {
        console.error("Error al crear preferencia:", error?.response?.data || error.message || error);
        res.status(500).json({ error: "Error al crear preferencia" });
    }
});

export default router;
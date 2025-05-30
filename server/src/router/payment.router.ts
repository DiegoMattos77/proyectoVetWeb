// src/routes/payment.router.ts
import { Router } from 'express';
import { createMercadoPagoPreference } from '../controllers/payment.controller';

const router = Router();

router.post('/payments', async (req, res) => {
    try {
        const { amount, method } = req.body;
        const preference = await createMercadoPagoPreference(amount, method);
        res.json(preference);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred.' });
        }
    }
});

export default router;
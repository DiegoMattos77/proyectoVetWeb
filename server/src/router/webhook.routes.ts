//routes/webhook.routes.ts
import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.controller';

const webhookRouter = Router();

// Ruta POST para recibir webhooks
webhookRouter.post('/mercado-pago', handleWebhook);

export default webhookRouter;
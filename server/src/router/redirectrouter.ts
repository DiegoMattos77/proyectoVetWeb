import { Router } from 'express';
import { handlePaymentRedirect } from '../controllers/payment.controller';

const router = Router();

router.get('/payment-redirect', handlePaymentRedirect);

export default router;
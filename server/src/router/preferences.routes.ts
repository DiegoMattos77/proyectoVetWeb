import { Router } from 'express';
import { createPreference, getPreference, getPublicKey } from '../controllers/preferences.controller';

const router = Router();

router.post('/preferences', createPreference);
router.get('/preferences/:id', getPreference);
router.get('/mp-public-key', getPublicKey);

export default router;
import { Router } from 'express';
import { createPreference, getPreference } from '../controllers/preferences.controller';

const router = Router();

router.post('/preferences', createPreference);
router.get('/preferences/:id', getPreference);

export default router;
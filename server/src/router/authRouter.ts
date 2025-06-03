import { Router } from 'express'
import { loginClientes, solicitarRecuperacionPassword, restablecerPassword } from '../controllers/authController'
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router()

router.post('/', loginClientes, inputErrors);
router.post("/solicitar-password", solicitarRecuperacionPassword);
router.post("/restablecer-password", restablecerPassword);
router.get('/cliente', loginClientes);

export default router
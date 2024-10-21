import { Router } from 'express'
import { loginClientes } from '../controllers/authController'
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router()

router.post('/',
    loginClientes, inputErrors
)

export default router
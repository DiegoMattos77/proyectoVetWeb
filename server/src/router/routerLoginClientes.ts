import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/loginClientesController';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';


const router = Router();

router.post('/',
    body('mail')
        .isString().notEmpty().withMessage('El mail no puede estar vacío')
        .isLength({ max: 35 }).withMessage('El mail no puede exceder los 35 caracteres')
        .isEmail().withMessage('El mail no es válido'),
    body('password')
        .isString().notEmpty().withMessage('La contraseña no puede estar vacía')
        .isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres'),
    inputErrors, createClient
);

router.get('/', getClients);

router.get('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, getClientById
);

router.put('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    body('mail')
        .isString().notEmpty().withMessage('El mail no puede estar vacío')
        .isLength({ max: 35 }).withMessage('El mail no puede exceder los 35 caracteres')
        .isEmail().withMessage('El mail no es válido'),
    body('password')
        .isString().notEmpty().withMessage('La contraseña no puede estar vacía')
        .isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres'),
    inputErrors, updateClient
);

router.delete('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, deleteClient
);

export default router;




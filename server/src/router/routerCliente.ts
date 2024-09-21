import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/clienteController';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.post('/',
    body('dni').isString().notEmpty().withMessage('El DNI no puede estar vacío'),
    body('cuit_cuil').isString().notEmpty().withMessage('El CUIT/CUIL no puede estar vacío'),
    body('nombre').isString().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('apellido').isString().notEmpty().withMessage('El apellido no puede estar vacío'),
    body('domicilio').isString().notEmpty().withMessage('El domicilio no puede estar vacío'),
    body('telefono').isString().notEmpty().withMessage('El teléfono no puede estar vacío'),
    body('mail').isString().notEmpty().withMessage('El mail no puede estar vacío'),
    body('estado').isString().notEmpty().withMessage('El estado no puede estar vacío'),
    inputErrors, createClient);

router.get('/', getClients);

router.get('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, getClientById);

router.put('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    body('dni').isString().notEmpty().withMessage('El DNI no puede estar vacío'),
    body('cuit_cuil').isString().notEmpty().withMessage('El CUIT/CUIL no puede estar vacío'),
    body('nombre').isString().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('apellido').isString().notEmpty().withMessage('El apellido no puede estar vacío'),
    body('domicilio').isString().notEmpty().withMessage('El domicilio no puede estar vacío'),
    body('telefono').isString().notEmpty().withMessage('El teléfono no puede estar vacío'),
    body('mail').isString().notEmpty().withMessage('El mail no puede estar vacío'),
    body('estado').isString().notEmpty().withMessage('El estado no puede estar vacío'),
    inputErrors, updateClient);

router.delete('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, deleteClient);

export default router;
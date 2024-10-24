import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, /*deleteClient*/ } from '../controllers/clienteController';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.post('/registrarme',
    body('dni')
        .isString().notEmpty().withMessage('El DNI no puede estar vacío')
        .isLength({ max: 10 }).withMessage('El DNI no puede exceder los 10 caracteres')
        .matches(/^\d+$/).withMessage('El DNI solo puede contener números'),
    body('cuit_cuil')
        .isString().notEmpty().withMessage('El CUIT/CUIL no puede estar vacío')
        .isLength({ max: 13 }).withMessage('El CUIT/CUIL no puede exceder los 13 caracteres')
        .matches(/^\d+$/).withMessage('El CUIT/CUIL solo puede contener números'),
    body('nombre')
        .isString().notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ max: 25 }).withMessage('El nombre no puede exceder los 25 caracteres'),
    body('apellido')
        .isString().notEmpty().withMessage('El apellido no puede estar vacío')
        .isLength({ max: 25 }).withMessage('El apellido no puede exceder los 25 caracteres'),
    body('domicilio')
        .isString().notEmpty().withMessage('El domicilio no puede estar vacío')
        .isLength({ max: 30 }).withMessage('El domicilio no puede exceder los 30 caracteres'),
    body('telefono')
        .isString().notEmpty().withMessage('El teléfono no puede estar vacío')
        .isLength({ max: 13 }).withMessage('El teléfono no puede exceder los 13 caracteres')
        .matches(/^\d+$/).withMessage('El teléfono solo puede contener números'),
    body('mail')
        .isString().notEmpty().withMessage('El mail no puede estar vacío')
        .isLength({ max: 35 }).withMessage('El mail no puede exceder los 35 caracteres'),
    body('estado')
        .isString().notEmpty().withMessage('El estado no puede estar vacío')
        .isLength({ max: 8 }).withMessage('El estado no puede exceder los 8 caracteres'),
    body('password'),
    inputErrors, createClient);

router.get('/', getClients);

router.get('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, getClientById);

router.put('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    body('dni')
        .isString().notEmpty().withMessage('El DNI no puede estar vacío')
        .isLength({ max: 10 }).withMessage('El DNI no puede exceder los 10 caracteres')
        .matches(/^\d+$/).withMessage('El DNI solo puede contener números'),
    body('cuit_cuil')
        .isString().notEmpty().withMessage('El CUIT/CUIL no puede estar vacío')
        .isLength({ max: 13 }).withMessage('El CUIT/CUIL no puede exceder los 13 caracteres')
        .matches(/^\d+$/).withMessage('El CUIT/CUIL solo puede contener números'),
    body('nombre')
        .isString().notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ max: 25 }).withMessage('El nombre no puede exceder los 25 caracteres'),
    body('apellido')
        .isString().notEmpty().withMessage('El apellido no puede estar vacío')
        .isLength({ max: 25 }).withMessage('El apellido no puede exceder los 25 caracteres'),
    body('domicilio')
        .isString().notEmpty().withMessage('El domicilio no puede estar vacío')
        .isLength({ max: 30 }).withMessage('El domicilio no puede exceder los 30 caracteres'),
    body('telefono')
        .isString().notEmpty().withMessage('El teléfono no puede estar vacío')
        .isLength({ max: 13 }).withMessage('El teléfono no puede exceder los 13 caracteres')
        .matches(/^\d+$/).withMessage('El teléfono solo puede contener números'),
    body('mail')
        .isString().notEmpty().withMessage('El mail no puede estar vacío')
        .isLength({ max: 35 }).withMessage('El mail no puede exceder los 35 caracteres'),
    body('estado')
        .isString().notEmpty().withMessage('El estado no puede estar vacío')
        .isLength({ max: 8 }).withMessage('El estado no puede exceder los 8 caracteres'),
    body('password'),
    inputErrors, updateClient);

// router.delete('/:id',
//     param('id').isNumeric().withMessage('El ID ingresado no es válido'),
//     inputErrors, deleteClient);

export default router;
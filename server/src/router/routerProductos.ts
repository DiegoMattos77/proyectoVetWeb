import { Router } from "express";
import { getProducto, getProductoById, verificarStock, actualizarStock } from "../controllers/productosController";
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.get('/', getProducto);

router.get('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, getProductoById
);

// Ruta para verificar stock de un producto
router.get('/:id/stock',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, verificarStock
);

// Ruta para actualizar stock (para uso administrativo)
router.put('/:id/stock',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    body('nuevo_stock').isNumeric().withMessage('El stock debe ser un número'),
    inputErrors, actualizarStock
);

export default router;
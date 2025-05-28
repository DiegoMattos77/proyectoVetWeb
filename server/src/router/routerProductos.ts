import { Router } from "express";
import { getProducto, getProductoById } from "../controllers/productosController";
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.get('/', getProducto);

router.get('/:id',
    param('id').isNumeric().withMessage('El ID ingresado no es válido'),
    inputErrors, getProductoById
);

export default router;
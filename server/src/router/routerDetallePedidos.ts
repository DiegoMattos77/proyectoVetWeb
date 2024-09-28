import { Router } from 'express';
import { createDetallePedido, getDetallePedido } from '../controllers/detallePedidosController';
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.post('/',
    body('id_pedido')
        .isNumeric().notEmpty().withMessage('El id_pedido no puede estar vacío'),
    body('id_producto')
        .isNumeric().notEmpty().withMessage('El id_producto no puede estar vacío'),
    body('precio_venta')
        .isNumeric().notEmpty().withMessage('El precio de venta no puede estar vacío'),
    body('cantidad')
        .isNumeric().notEmpty().withMessage('La cantidad no puede estar vacía'),
    body('descuento')
        .isNumeric().notEmpty().withMessage('El descuento no puede estar vacío'),
    inputErrors, createDetallePedido);

router.get('/', getDetallePedido);

export default router;
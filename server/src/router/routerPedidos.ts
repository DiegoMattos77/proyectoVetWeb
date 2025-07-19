import { Router } from "express";
import { createPedido, getPedido, getPedidoByPaymentId } from "../controllers/pedidosController";
import { body, param } from 'express-validator';
import { inputErrors } from '../middleware';

const router = Router();

router.post('/',
    body('id_cliente')
        .isNumeric().notEmpty().withMessage('El id_cliente no puede estar vacío'),
    body('fecha_pedido')
        .isDate().notEmpty().withMessage('La fecha no puede estar vacía'),
    inputErrors, createPedido);

router.get('/', getPedido);

// Ruta para buscar pedido por payment_id
router.get('/payment/:paymentId', getPedidoByPaymentId);

export default router;

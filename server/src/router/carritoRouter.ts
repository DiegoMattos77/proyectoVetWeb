import { Router } from 'express';
import { verificarYLimpiarCarrito } from '../controllers/carritoController';

const router = Router();

// Ruta para verificar si el carrito debe ser limpiado después de un pago exitoso
router.get('/verificar-limpieza/:clienteId', verificarYLimpiarCarrito);

export default router;

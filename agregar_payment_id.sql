-- Script para agregar la columna payment_id a la tabla pedidos
-- Esta columna almacenará el ID del pago de Mercado Pago para poder vincular pagos con pedidos
ALTER TABLE pedidos
ADD COLUMN payment_id VARCHAR(255) NULL;
-- Verificar que la columna se agregó correctamente
DESCRIBE pedidos;
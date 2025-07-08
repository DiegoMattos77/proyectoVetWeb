import { Request, Response } from 'express';

// Store de pagos exitosos temporalmente (en producción usar Redis o base de datos)
const pagosExitosos = new Set<string>();

// Limpiar el store cada 30 minutos para evitar memory leaks
setInterval(() => {
    pagosExitosos.clear();
    console.log('🧹 Store de pagos exitosos limpiado');
}, 30 * 60 * 1000);

export const marcarPagoExitoso = (clienteId: string, pagoId: string) => {
    const key = `${clienteId}_${pagoId}`;
    pagosExitosos.add(key);
    console.log(`✅ Pago exitoso marcado: ${key}`);
    
    // Auto-limpiar este pago específico después de 10 minutos
    setTimeout(() => {
        pagosExitosos.delete(key);
        console.log(`🗑️ Pago exitoso auto-limpiado: ${key}`);
    }, 10 * 60 * 1000);
};

export const verificarYLimpiarCarrito = async (req: Request, res: Response) => {
    try {
        const { clienteId } = req.params;
        
        if (!clienteId) {
            return res.status(400).json({ error: 'Cliente ID requerido' });
        }
        
        // Buscar si hay algún pago exitoso para este cliente
        const pagoExitoso = Array.from(pagosExitosos).find(key => key.startsWith(`${clienteId}_`));
        
        if (pagoExitoso) {
            console.log(`🔔 Pago exitoso encontrado para cliente ${clienteId}: ${pagoExitoso}`);
            
            // Remover de la lista para que no se vuelva a procesar
            pagosExitosos.delete(pagoExitoso);
            
            return res.json({ 
                limpiarCarrito: true, 
                pagoId: pagoExitoso.split('_')[1],
                mensaje: 'Carrito debe ser limpiado por pago exitoso'
            });
        }
        
        return res.json({ 
            limpiarCarrito: false,
            mensaje: 'No hay pagos pendientes de procesar'
        });
        
    } catch (error) {
        console.error('Error al verificar carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export { pagosExitosos };

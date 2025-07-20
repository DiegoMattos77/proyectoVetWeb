import { Request, Response, NextFunction } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { config } from '../config/db';
import crypto from 'crypto';
import { mercadopago } from '../config/mercadopago';
import Productos from '../models/Productos.models';
import Pedidos from '../models/Pedidos.models';
import DetallePedidos from '../models/DetallePedidos.models';
import { db } from '../config/db';
import jwt from "jsonwebtoken";
import axios from 'axios';

// Cache para evitar procesar el mismo pago dos veces
const processedPayments = new Set<string>();

// Limpiar cache cada 10 minutos para evitar memory leaks
setInterval(() => {
    processedPayments.clear();
    console.log('🧹 Cache de pagos procesados limpiado');
}, 10 * 60 * 1000);

// Función para crear el pedido en la base de datos
const crearPedidoEnBD = async (items: any[], external_reference: string, paymentId: string) => {
    const transaction = await db.transaction();

    try {
        console.log('📝 Iniciando creación de pedido en BD...');

        // Extraer el ID del cliente del external_reference
        let id_cliente = null;
        if (external_reference && external_reference.includes('cliente_')) {
            const clienteMatch = external_reference.match(/cliente_(\d+)/);
            if (clienteMatch) {
                id_cliente = parseInt(clienteMatch[1]);
                console.log(`👤 ID del cliente extraído: ${id_cliente}`);
            }
        }

        if (!id_cliente) {
            throw new Error('No se pudo extraer el ID del cliente del external_reference');
        }

        // Obtener el próximo ID de pedido (el más grande + 1)
        const ultimoPedido = await Pedidos.findOne({
            order: [['id_pedido', 'DESC']],
            transaction
        });

        const proximoIdPedido = ultimoPedido ? parseInt(ultimoPedido.id_pedido.toString()) + 1 : 1;
        console.log(`🆔 Próximo ID de pedido: ${proximoIdPedido}`);

        // Calcular el importe total del pedido
        let importeTotal = 0;
        const itemsConPrecios = [];

        for (const item of items) {
            const producto = await Productos.findByPk(item.id, { transaction });

            if (!producto) {
                throw new Error(`Producto con ID ${item.id} no encontrado`);
            }

            const cantidad = item.quantity || item.cantidad;
            const subtotal = producto.precio_venta * cantidad;
            importeTotal += subtotal;

            itemsConPrecios.push({
                ...item,
                precio_venta: producto.precio_venta,
                cantidad: cantidad,
                subtotal: subtotal,
                producto: producto
            });
        }

        console.log(`💰 Importe total calculado: $${importeTotal}`);

        // Crear el pedido principal con ID manual usando timestamp específico
        const fechaActual = new Date();
        console.log(`🕐 Fecha/hora actual UTC: ${fechaActual.toISOString()}`);

        // Ajustar a zona horaria Argentina (UTC-3) - CORREGIDO
        const fechaArgentina = new Date(fechaActual.getTime() - (3 * 60 * 60 * 1000));
        const fechaMySQL = fechaArgentina.toISOString().slice(0, 19).replace('T', ' ');
        console.log(`🕐 Fecha formateada para Argentina (UTC-3): ${fechaMySQL}`);
        console.log(`🕐 Hora local actual debería ser: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`);

        // Usar query SQL directa con CAST para forzar DATETIME
        await db.query(`
            INSERT INTO pedidos (id_pedido, id_cliente, id_empleados, fecha_pedido, importe, venta_web, anulacion, payment_id) 
            VALUES (?, ?, ?, CAST(? AS DATETIME), ?, ?, ?, ?)
        `, {
            replacements: [proximoIdPedido, id_cliente, 4, fechaMySQL, importeTotal, 1, 0, paymentId],
            transaction
        });

        console.log(`✅ Pedido creado con DATETIME Argentina: ${proximoIdPedido} - ${fechaMySQL}`);

        // Crear los detalles del pedido
        for (const itemConPrecio of itemsConPrecios) {
            await DetallePedidos.create({
                id_pedido: proximoIdPedido, // Usar el ID calculado manualmente
                id_producto: parseInt(itemConPrecio.id),
                precio_venta: itemConPrecio.precio_venta,
                cantidad: itemConPrecio.cantidad,
                descuento: 0 // Por defecto sin descuento
            }, { transaction });

            console.log(`✅ Detalle creado para producto ${itemConPrecio.producto.descripcion}, cantidad: ${itemConPrecio.cantidad}, subtotal: $${itemConPrecio.subtotal}`);
        }

        // El sistema nuevo consulta directamente la base de datos, no necesitamos marcar nada
        console.log(`✅ Pedido creado exitosamente para cliente: ${id_cliente}. El sistema detectará automáticamente el pago.`);

        await transaction.commit();
        console.log('✅ Pedido completo creado exitosamente en la BD');

        return {
            id_pedido: proximoIdPedido, // Usar el ID calculado manualmente
            id_cliente: id_cliente,
            success: true
        };

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error al crear pedido en BD:', error);
        throw error;
    }
};
const actualizarStock = async (items: any[]) => {
    const transaction = await db.transaction();

    try {
        console.log('🔄 Iniciando actualización de stock para items:', items);

        for (const item of items) {
            const productoId = parseInt(item.id);
            const cantidadComprada = item.quantity;

            // Buscar el producto y bloquear la fila para evitar condiciones de carrera
            const producto = await Productos.findByPk(productoId, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!producto) {
                console.error(`❌ Producto con ID ${productoId} no encontrado`);
                continue;
            }

            // Verificar que hay suficiente stock
            if (producto.stock < cantidadComprada) {
                console.error(`❌ Stock insuficiente para producto ${producto.descripcion}. Stock actual: ${producto.stock}, Solicitado: ${cantidadComprada}`);
                throw new Error(`Stock insuficiente para ${producto.descripcion}`);
            }

            // Calcular nuevo stock
            const stockAnterior = producto.stock; // Guardar el stock anterior ANTES de actualizar
            const nuevoStock = producto.stock - cantidadComprada;

            // Actualizar el stock
            await producto.update({ stock: nuevoStock }, { transaction });

            console.log(`✅ Stock actualizado - Producto: ${producto.descripcion}, Stock anterior: ${stockAnterior}, Cantidad vendida: ${cantidadComprada}, Stock nuevo: ${nuevoStock}`);
        }

        await transaction.commit();
        console.log('✅ Actualización de stock completada exitosamente');
        return true;

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error al actualizar stock:', error);
        throw error;
    }
};

// Función para extraer datos del external_reference
const extraerDatosDelExternalReference = (externalRef: string) => {
    try {
        // El external_reference tiene formato: pedido_timestamp_cliente_id_carrito_encodedData
        const parts = externalRef.split('_');
        if (parts.length >= 6 && parts[0] === 'pedido' && parts[4] === 'carrito') {
            const encodedData = parts[5];
            const carritoData = JSON.parse(atob(encodedData));
            return {
                timestamp: parts[1],
                cliente_id: parts[3],
                carrito: carritoData
            };
        }
        return null;
    } catch (error) {
        console.error('Error al parsear external_reference:', error);
        return null;
    }
};

// Función para generar factura automáticamente después del pago exitoso
const generarFacturaAutomatica = async (pedidoId: number, clienteId: number, items: any[], total: number) => {
    try {
        console.log(`📄 Generando factura automática para pedido ${pedidoId}, cliente ${clienteId}`);

        // Llamar al endpoint interno para generar la factura
        const response = await axios.post(`http://localhost:4000/api/generar-factura-pedido/${pedidoId}`, {}, {
            timeout: 30000 // 30 segundos de timeout
        });

        if (response.data.success) {
            console.log(`✅ Factura generada: ${response.data.numeroFactura}`);
            console.log(`📄 URL de descarga: ${response.data.downloadUrl}`);

            return {
                success: true,
                numeroFactura: response.data.numeroFactura,
                downloadUrl: response.data.downloadUrl,
                mensaje: response.data.mensaje
            };
        } else {
            throw new Error('Error en la respuesta del servicio de facturas');
        }

    } catch (error: any) {
        console.error('❌ Error al generar factura automática:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Webhook recibido:', JSON.stringify(req.body, null, 2));

        // 1. Verificar si es una notificación de prueba
        const isTestNotification = req.body.id === "123456" && req.body.live_mode === false;

        if (isTestNotification) {
            console.log('Notificación de prueba recibida - Respondiendo OK sin procesar');
            res.status(200).json({ status: 'OK', message: 'Test notification received' });
            return;
        }

        // 2. Verificar firma en producción
        if (process.env.NODE_ENV === 'production') {
            const signature = req.headers['x-signature'] as string;
            if (!signature) {
                console.warn('Intento de acceso no autorizado: firma no proporcionada');
                res.status(401).json({ error: 'Firma no proporcionada' });
                return;
            }

            const expectedSignature = crypto
                .createHmac('sha256', config.accessToken)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (signature !== `sha256=${expectedSignature}`) {
                console.warn('Intento de acceso no autorizado: firma inválida');
                res.status(401).json({ error: 'Firma inválida' });
                return;
            }
        }

        // 3. Extraer ID del pago con múltiples formatos posibles
        let paymentId: string | null = null;

        // Formato 1: { action: "payment.created", data: { id: "123" } }
        if (req.body.data && req.body.data.id) {
            paymentId = req.body.data.id.toString();
            console.log('💡 Payment ID encontrado en data.id:', paymentId);
        }
        // Formato 2: { id: "123" }
        else if (req.body.id) {
            paymentId = req.body.id.toString();
            console.log('💡 Payment ID encontrado en id:', paymentId);
        }
        // Formato 3: { resource: "123", topic: "payment" }
        else if (req.body.resource && req.body.topic === 'payment') {
            paymentId = req.body.resource.toString();
            console.log('💡 Payment ID encontrado en resource (topic payment):', paymentId);
        }
        // Formato 4: Merchant Order - ignorar por ahora
        else if (req.body.topic === 'merchant_order') {
            console.log('📦 Merchant order recibida - ignorando por ahora');
            res.status(200).json({ status: 'OK', message: 'Merchant order ignored' });
            return;
        }

        if (!paymentId) {
            console.error('❌ ID de pago no encontrado en el webhook:', req.body);
            res.status(400).json({ error: 'ID de pago no proporcionado' });
            return;
        }

        console.log('🔍 Buscando pago con ID:', paymentId);

        // 4. Obtener datos del pago desde Mercado Pago
        try {
            const paymentData = await mercadopago.payments.get({ id: paymentId.toString() });
            console.log('📊 Datos del pago recibidos:', {
                id: paymentData.id,
                status: paymentData.status,
                status_detail: paymentData.status_detail,
                external_reference: (paymentData as any).external_reference,
                preference_id: (paymentData as any).preference_id
            });

            // 5. Manejar diferentes estados del pago
            switch (paymentData.status) {
                case 'approved':
                    console.log('💰 Pago aprobado:', paymentData.id);

                    // Verificar si ya procesamos este pago
                    const paymentKey = `${paymentData.id}_${paymentData.status}`;
                    if (processedPayments.has(paymentKey)) {
                        console.log('⏭️ Pago ya procesado anteriormente, saltando...', paymentData.id);
                        res.status(200).json({ status: 'OK', message: 'Payment already processed' });
                        return;
                    }

                    // Marcar como procesado ANTES de procesar para evitar duplicados
                    processedPayments.add(paymentKey);
                    console.log('🔒 Pago marcado como procesado:', paymentKey);

                    // ✨ NUEVA FUNCIONALIDAD: Descontar stock automáticamente
                    try {
                        let items: any[] = [];
                        let metodoProcesamiento = '';

                        // Método 1: Intentar obtener items de la preferencia
                        console.log('🔍 Método 1: Intentando obtener datos de la preferencia...');
                        const preferenceId = (paymentData as any).preference_id;
                        console.log('Preference ID:', preferenceId);

                        if (preferenceId) {
                            try {
                                const preference = await mercadopago.preferences.get({
                                    preferenceId: preferenceId
                                });
                                console.log('📦 Preferencia obtenida:', preference);
                                items = preference.items || [];
                                metodoProcesamiento = 'preferencia';
                                console.log('✅ Items obtenidos de la preferencia:', items);
                            } catch (prefError: any) {
                                console.warn('⚠️ Error al acceder a la preferencia:', prefError.message);
                            }
                        } else {
                            console.warn('⚠️ Preference ID no disponible');
                        }

                        // Método 2: Usar metadata como fallback si no tenemos items
                        if (items.length === 0) {
                            console.log('🔍 Método 2: Intentando usar metadata del pago...');
                            try {
                                const metadata = (paymentData as any).metadata;
                                if (metadata && metadata.carrito_items) {
                                    const carritoItems = JSON.parse(metadata.carrito_items);
                                    console.log('📦 Items obtenidos del metadata:', carritoItems);

                                    // Convertir formato de metadata a formato de items
                                    items = carritoItems.map((item: any) => ({
                                        id: item.id.toString(),
                                        quantity: Number(item.quantity)
                                    }));
                                    metodoProcesamiento = 'metadata';
                                    console.log('✅ Items convertidos del metadata:', items);
                                }
                            } catch (metadataError) {
                                console.warn('⚠️ Error al procesar metadata:', metadataError);
                            }
                        }

                        // Método 3: Usar additional_info como fallback si aún no tenemos items
                        if (items.length === 0) {
                            console.log('🔍 Método 3: Intentando usar additional_info del pago...');
                            try {
                                const additionalInfo = (paymentData as any).additional_info;
                                if (additionalInfo && additionalInfo.items) {
                                    console.log('📦 Items obtenidos del additional_info:', additionalInfo.items);

                                    // Convertir formato de additional_info a formato de items
                                    items = additionalInfo.items.map((item: any) => ({
                                        id: item.id.toString(),
                                        quantity: Number(item.quantity)
                                    }));
                                    metodoProcesamiento = 'additional_info';
                                    console.log('✅ Items convertidos del additional_info:', items);
                                }
                            } catch (additionalError) {
                                console.warn('⚠️ Error al procesar additional_info:', additionalError);
                            }
                        }

                        // Método 4: Usar external_reference como último recurso
                        if (items.length === 0) {
                            console.log('🔍 Método 4: Intentando usar external_reference...');
                            try {
                                const externalRef = (paymentData as any).external_reference;
                                if (externalRef && externalRef.includes('carrito_')) {
                                    console.log('🔍 External reference encontrado:', externalRef);
                                    const carritoMatch = externalRef.match(/carrito_([^_]+)/);
                                    if (carritoMatch) {
                                        const carritoBase64 = carritoMatch[1];
                                        const carritoData = JSON.parse(atob(carritoBase64));
                                        console.log('📦 Items decodificados del external_reference:', carritoData);

                                        // Convertir formato del carrito a formato de items
                                        items = carritoData.map((item: any) => ({
                                            id: item.id.toString(),
                                            quantity: Number(item.qty)
                                        }));
                                        metodoProcesamiento = 'external_reference';
                                        console.log('✅ Items convertidos del external_reference:', items);
                                    }
                                }
                            } catch (refError) {
                                console.warn('⚠️ Error al procesar external_reference:', refError);
                            }
                        }

                        // Procesar items si los encontramos
                        if (items && items.length > 0) {
                            console.log(`🛒 Procesando ${items.length} items usando método: ${metodoProcesamiento}`);
                            console.log('🛒 Items finales a procesar:', items);

                            // 1. Actualizar stock de productos
                            await actualizarStock(items);
                            console.log('✅ Stock actualizado correctamente para el pago:', paymentData.id);

                            // 2. Crear pedido en la base de datos
                            const externalRef = (paymentData as any).external_reference;
                            if (externalRef) {
                                try {
                                    const pedidoResult = await crearPedidoEnBD(items, externalRef, paymentData.id.toString());
                                    console.log(`✅ Pedido creado en BD: ${pedidoResult.id_pedido} para cliente: ${pedidoResult.id_cliente}`);

                                    // 3. NUEVO: Generar factura automáticamente después del pago exitoso
                                    console.log('📄 Iniciando generación automática de factura...');
                                    const facturaResult = await generarFacturaAutomatica(
                                        pedidoResult.id_pedido,
                                        pedidoResult.id_cliente,
                                        items,
                                        parseFloat((paymentData as any).transaction_amount || '0')
                                    );

                                    if (facturaResult.success) {
                                        console.log(`✅ ${facturaResult.mensaje}`);
                                    } else {
                                        console.error(`❌ Error en factura: ${facturaResult.error}`);
                                    }

                                } catch (pedidoError) {
                                    console.error('❌ Error al crear pedido en BD:', pedidoError);
                                    // No lanzamos el error para no afectar el procesamiento del pago
                                }
                            } else {
                                console.warn('⚠️ No se encontró external_reference, no se puede crear el pedido en BD');
                            }

                            // 3. NUEVO: Crear un indicador para que el frontend sepa que debe limpiar el carrito
                            // Extraer el cliente ID del external_reference si está disponible
                            if (externalRef && externalRef.includes('cliente_')) {
                                const clienteMatch = externalRef.match(/cliente_(\d+)/);
                                if (clienteMatch) {
                                    const clienteId = clienteMatch[1];
                                    console.log(`✅ Pago procesado exitosamente - Cliente: ${clienteId}, Pago: ${paymentData.id}`);

                                    // El sistema nuevo consulta directamente la base de datos
                                    console.log(`🔔 PAGO_COMPLETADO: Cliente ${clienteId} completó pago ${paymentData.id}. Sistema nuevo detectará automáticamente.`);
                                }
                            }
                        } else {
                            console.error('❌ No se pudieron obtener los items del pago después de todos los métodos');
                            console.log('📋 Verificar que alguno de estos contenga datos:');
                            console.log('   - preference_id:', (paymentData as any).preference_id);
                            console.log('   - metadata.carrito_items:', (paymentData as any).metadata?.carrito_items);
                            console.log('   - additional_info.items:', (paymentData as any).additional_info?.items?.length);
                            console.log('   - external_reference:', (paymentData as any).external_reference);
                        }

                    } catch (stockError: any) {
                        console.error('❌ Error al actualizar stock para pago aprobado:', stockError);

                        // Log específico para problemas de acceso
                        if (stockError.message?.includes('denied') || stockError.message?.includes('403')) {
                            console.error('🔒 Error de acceso - Verificar permisos de la aplicación de Mercado Pago');
                        }

                        // Nota: No detener el proceso aunque falle la actualización del stock
                        // El pago ya fue aprobado, solo registrar el error
                    }
                    break;

                case 'pending':
                    console.log('⏳ Pago pendiente:', paymentData.id);
                    break;

                case 'rejected':
                    console.log('❌ Pago rechazado:', paymentData.id);
                    break;

                default:
                    console.log('❓ Estado desconocido:', paymentData.status);
            }

            // 6. Responder OK a Mercado Pago
            res.status(200).json({ status: 'OK' });
        } catch (error: any) {
            console.error('💥 Error al obtener el pago de Mercado Pago:', {
                message: error.message,
                status: error.response?.status,
                paymentId: paymentId
            });

            // Manejar específicamente el error 404
            if (error.response?.status === 404 || error.message?.includes('not found') || error.message?.includes('Payment not found')) {
                console.warn(`⚠️ Pago ${paymentId} no encontrado - posiblemente eliminado, ID incorrecto, o pago de sandbox`);
                res.status(200).json({
                    status: 'Warning',
                    message: 'Payment not found in Mercado Pago, but webhook processed',
                    paymentId: paymentId
                });
                return;
            }

            // Para otros errores, intentar continuar
            console.error('💥 Error inesperado:', error);
            res.status(200).json({
                status: 'Error',
                message: 'Error processing payment but webhook acknowledged',
                error: error.message
            });
            return;
        }
    } catch (error) {
        console.error('Error procesando webhook:', error);
        next(error);
    }
};
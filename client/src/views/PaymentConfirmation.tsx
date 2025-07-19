import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CotextoCarrito';
import Swal from 'sweetalert2';

const PaymentConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const { limpiarCarrito } = useCart();
    const [showButton, setShowButton] = useState(false);
    const [pedidoId, setPedidoId] = useState<string | null>(null);
    const [showFacturaButton, setShowFacturaButton] = useState(false);

    // Función para obtener el pedido asociado a un payment_id
    const obtenerPedidoPorPaymentId = async (paymentId: string) => {
        try {
            console.log('🔍 Buscando pedido para payment_id:', paymentId);

            // Buscar por payment_id en la tabla de pedidos
            const response = await fetch(`http://localhost:4000/api/pedidos/payment/${paymentId}`);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Pedido encontrado:', data);
                setPedidoId(data.id_pedido.toString());
                setShowFacturaButton(true);
            } else {
                console.log('⚠️ No se encontró pedido para este payment_id, reintentando...');
                // Intentar nuevamente después de un delay (el webhook puede estar procesando)
                setTimeout(() => {
                    obtenerPedidoPorPaymentId(paymentId);
                }, 3000);
            }
        } catch (error) {
            console.error('❌ Error al buscar pedido:', error);
            // En caso de error, mostrar opción de ir a "Mis Facturas" después de un tiempo
            setTimeout(() => {
                setShowFacturaButton(true);
            }, 5000);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const collectionStatus = urlParams.get('collection_status');
        const paymentId = urlParams.get('payment_id');
        const preferenceId = urlParams.get('preference_id') || urlParams.get('preference-id');
        const clearCart = urlParams.get('clearCart');

        console.log('📄 PaymentConfirmation - Parámetros recibidos:', {
            status,
            collectionStatus,
            paymentId,
            preferenceId,
            clearCart,
            allParams: Object.fromEntries(urlParams.entries())
        });

        // Lógica mejorada para determinar el estado del pago
        const isSuccess = status === 'approved' ||
            collectionStatus === 'approved' ||
            status === 'success';
        const isFailure = status === 'rejected' ||
            collectionStatus === 'rejected' ||
            status === 'failure';
        const isPending = status === 'pending' ||
            collectionStatus === 'pending';

        // Si hay payment_id, intentamos obtener el pedido asociado
        if (paymentId && isSuccess) {
            console.log('💳 Buscando pedido asociado al payment_id:', paymentId);
            obtenerPedidoPorPaymentId(paymentId);
        }

        if (isSuccess) {
            console.log('🎉 Pago exitoso confirmado desde PaymentConfirmation');

            // Limpiar carrito de forma robusta
            const forzarLimpiezaCarrito = () => {
                console.log('🧹 Iniciando limpieza forzada del carrito...');

                // 1. Limpiar usando el contexto
                try {
                    limpiarCarrito();
                    console.log('✅ Función limpiarCarrito() del contexto ejecutada');
                } catch (error) {
                    console.error('❌ Error al ejecutar limpiarCarrito():', error);
                }

                // 2. Limpiar localStorage directamente
                const currentUser = localStorage.getItem('userName');
                console.log('👤 Usuario actual:', currentUser);

                if (currentUser) {
                    const carritoKey = `carrito_${currentUser}`;
                    const carritoAntes = localStorage.getItem(carritoKey);
                    console.log(`📦 Carrito antes de limpiar (${carritoKey}):`, carritoAntes);

                    localStorage.setItem(carritoKey, JSON.stringify([]));
                    localStorage.removeItem(carritoKey); // También removemos la clave

                    const carritoDespues = localStorage.getItem(carritoKey);
                    console.log(`📦 Carrito después de limpiar (${carritoKey}):`, carritoDespues);
                }

                // 3. Limpiar cualquier carrito que pueda estar en localStorage
                const allKeys = Object.keys(localStorage);
                console.log('🔍 Todas las claves en localStorage:', allKeys);

                allKeys.forEach(key => {
                    if (key.startsWith('carrito_')) {
                        const valorAntes = localStorage.getItem(key);
                        console.log(`📦 Limpiando ${key}, valor antes:`, valorAntes);

                        localStorage.setItem(key, JSON.stringify([]));
                        localStorage.removeItem(key); // También removemos la clave

                        console.log(`✅ Carrito limpiado y removido: ${key}`);
                    }
                });

                // 4. Trigger evento de limpieza
                window.dispatchEvent(new Event('cart-cleared'));
                console.log('📡 Evento cart-cleared disparado');

                // 5. Trigger evento de storage para forzar actualización
                window.dispatchEvent(new Event('storage'));
                console.log('📡 Evento storage disparado');

                // 6. Verificación final
                setTimeout(() => {
                    const verificacionFinal = Object.keys(localStorage).filter(key => key.startsWith('carrito_'));
                    console.log('🔍 Verificación final - carritos restantes:', verificacionFinal);
                }, 100);

                console.log('🎯 Limpieza forzada del carrito completada');
            };

            forzarLimpiezaCarrito();

            // Mostrar mensaje de éxito y redirigir
            Swal.fire({
                title: '¡Pago exitoso!',
                html: `
                    <p>Tu compra ha sido procesada correctamente.</p>
                    <p>El stock se ha actualizado automáticamente.</p>
                    <br>
                    <p><strong>📄 Tu factura está siendo generada</strong></p>
                    <p>Podrás descargarla una vez que se complete el proceso.</p>
                `,
                icon: 'success',
                confirmButtonColor: '#7c3aed',
                timer: 5000,
                showConfirmButton: true
            }).then(() => {
                // Activar la opción de mostrar botón de factura después de un delay
                setShowFacturaButton(true);

                // Intentar obtener el payment_id para descargar factura
                if (paymentId) {
                    console.log('💳 Payment ID disponible para factura:', paymentId);
                    setPedidoId(paymentId); // Usaremos el payment_id temporalmente
                }

                // Redirigir a la página principal con parámetros de éxito después de mostrar la factura
                setTimeout(() => {
                    console.log('🏠 Redirigiendo a la página principal...');
                    navigate('/?payment=success&clearCart=true', { replace: true });
                }, 3000); // Dar tiempo para mostrar el botón de descarga
            });
        } else if (isFailure) {
            Swal.fire({
                title: 'Pago fallido',
                text: 'Hubo un problema con tu pago. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonColor: '#7c3aed'
            }).then(() => {
                navigate('/?payment=failure', { replace: true });
            });
        } else if (isPending) {
            Swal.fire({
                title: 'Pago pendiente',
                text: 'Tu pago está siendo procesado. Te notificaremos cuando esté completado.',
                icon: 'info',
                confirmButtonColor: '#7c3aed'
            }).then(() => {
                navigate('/?payment=pending', { replace: true });
            });
        } else {
            console.log('⚠️ Estado de pago desconocido, redirigiendo a inicio');
            navigate('/', { replace: true });
        }

        // Timeout de seguridad: si después de 10 segundos no se ha redirigido, forzar redirección
        const timeoutId = setTimeout(() => {
            console.log('⏰ Timeout de seguridad activado - redirigiendo a inicio');
            setShowButton(true); // Mostrar botón si no se redirecciona automáticamente
        }, 5000);

        // Auto-redirección después de 15 segundos
        const autoRedirectId = setTimeout(() => {
            console.log('🚀 Auto-redirección activada');
            navigate('/', { replace: true });
        }, 15000);

        // Limpiar timeouts si el componente se desmonta
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(autoRedirectId);
        };
    }, [navigate, limpiarCarrito]);

    const handleGoToHome = () => {
        navigate('/', { replace: true });
    };

    const handleDescargarFactura = async () => {
        if (!pedidoId) {
            alert('No se puede descargar la factura en este momento. Por favor, contacta con soporte.');
            return;
        }

        try {
            // Intentar descargar usando el payment_id como referencia
            // En un caso real, necesitarías mapear el payment_id al pedido_id
            const response = await fetch(`http://localhost:4000/api/descargar-factura-pedido/${pedidoId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    alert('La factura aún no está lista. Por favor, inténtalo en unos minutos.');
                } else {
                    throw new Error('Error al descargar la factura');
                }
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factura_${pedidoId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            Swal.fire({
                title: '¡Factura descargada!',
                text: 'La factura se ha descargado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error al descargar factura:', error);
            alert('Error al descargar la factura. Por favor, inténtalo más tarde.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
                <h2 className="text-2xl font-semibold text-gray-700 mt-4">
                    Procesando tu pago...
                </h2>
                <p className="text-gray-500 mt-2">
                    Por favor espera mientras confirmamos tu compra.
                </p>

                {showButton && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-600 mb-4">
                            ¿La página no se redirecciona automáticamente?
                        </p>
                        <button
                            onClick={handleGoToHome}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Ir a la página principal
                        </button>
                    </div>
                )}

                {showFacturaButton && pedidoId && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            📄 ¡Tu factura está lista!
                        </h3>
                        <p className="text-sm text-green-700 mb-4">
                            Puedes descargar tu factura haciendo clic en el siguiente botón:
                        </p>
                        <button
                            onClick={handleDescargarFactura}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mr-3"
                        >
                            📄 Descargar Factura PDF
                        </button>
                        <button
                            onClick={handleGoToHome}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Continuar comprando
                        </button>
                    </div>
                )}

                {showFacturaButton && !pedidoId && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            🎉 ¡Pago realizado con éxito!
                        </h3>
                        <p className="text-sm text-blue-700 mb-4">
                            Tu factura se está generando. Puedes acceder a todas tus facturas desde tu cuenta:
                        </p>
                        <button
                            onClick={() => navigate('/mis-facturas')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mr-3"
                        >
                            📄 Ver Mis Facturas
                        </button>
                        <button
                            onClick={handleGoToHome}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentConfirmation;

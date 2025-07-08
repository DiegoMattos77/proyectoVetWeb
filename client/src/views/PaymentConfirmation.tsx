import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CotextoCarrito';
import Swal from 'sweetalert2';

const PaymentConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const { limpiarCarrito } = useCart();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const collectionStatus = urlParams.get('collection_status');
        const paymentId = urlParams.get('payment_id');
        const preferenceId = urlParams.get('preference-id');
        const clearCart = urlParams.get('clearCart');

        console.log('📄 PaymentConfirmation - Parámetros recibidos:', {
            status,
            collectionStatus,
            paymentId,
            preferenceId,
            clearCart,
            allParams: Object.fromEntries(urlParams.entries())
        });

        const isSuccess = status === 'approved' || 
            collectionStatus === 'approved' || 
            status === 'success' ||
            (preferenceId && !status); // Si hay preference-id pero no status, asumimos éxito
        const isFailure = status === 'rejected' || collectionStatus === 'rejected' || status === 'failure';
        const isPending = status === 'pending' || collectionStatus === 'pending';

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
                text: 'Tu compra ha sido procesada correctamente. El stock se ha actualizado automáticamente.',
                icon: 'success',
                confirmButtonColor: '#7c3aed',
                timer: 3000,
                showConfirmButton: true
            }).then(() => {
                // Redirigir a la página principal con parámetros de éxito
                console.log('🏠 Redirigiendo a la página principal...');
                navigate('/?payment=success&clearCart=true', { replace: true });
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
            </div>
        </div>
    );
};

export default PaymentConfirmation;

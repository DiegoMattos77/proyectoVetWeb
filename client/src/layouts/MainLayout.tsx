import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ToastContainer } from 'react-toastify'
import { useCart } from '../components/CotextoCarrito'
import 'react-toastify/dist/ReactToastify.css'

const MainLayout = () => {
    const { limpiarCarrito } = useCart();

    // Hook global para detectar pagos exitosos desde Mercado Pago
    useEffect(() => {
        const detectarPagoExitoso = () => {
            const referrer = document.referrer;
            const vieneDeMercadoPago = referrer.includes('mercadopago.com') || 
                                    referrer.includes('mercadolibre.com');
            
            const urlParams = new URLSearchParams(window.location.search);
            const hasPaymentParams = urlParams.has('preference-id') || 
                                   urlParams.has('payment_id') ||
                                   urlParams.has('collection_status') ||
                                   urlParams.get('payment') === 'success';

            if (vieneDeMercadoPago || hasPaymentParams) {
                console.log('🌐 GlobalPaymentDetector: Pago exitoso detectado en MainLayout');
                console.log('🔍 Detalles:', {
                    referrer,
                    vieneDeMercadoPago,
                    hasPaymentParams,
                    currentPath: window.location.pathname,
                    params: Object.fromEntries(urlParams.entries())
                });

                // Limpiar carrito inmediatamente
                setTimeout(() => {
                    console.log('🧹 MainLayout: Limpiando carrito...');
                    
                    // Limpiar usando el contexto
                    limpiarCarrito();
                    
                    // Limpiar localStorage directamente
                    const currentUser = localStorage.getItem('userName');
                    if (currentUser) {
                        const carritoKey = `carrito_${currentUser}`;
                        localStorage.removeItem(carritoKey);
                        console.log(`✅ MainLayout: Carrito removido para ${currentUser}`);
                    }

                    // Limpiar todos los carritos
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('carrito_')) {
                            localStorage.removeItem(key);
                            console.log(`✅ MainLayout: Carrito removido ${key}`);
                        }
                    });

                    // Disparar eventos
                    window.dispatchEvent(new Event('cart-cleared'));
                    window.dispatchEvent(new Event('storage'));
                }, 100);
            }
        };

        // Ejecutar al cargar la página
        detectarPagoExitoso();

        // También ejecutar cuando cambien los parámetros de URL
        const handlePopState = () => {
            setTimeout(detectarPagoExitoso, 100);
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [limpiarCarrito]);

    return (
        <>
            <Header />
            <ToastContainer />
            <main className="pt-24">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout
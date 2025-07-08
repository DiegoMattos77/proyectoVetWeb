import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { obtenerProductos } from "../services/ProductosService";
import InicioProductDetalle from "../components/Section";
import { Productos } from "../types/index";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaBell } from "react-icons/fa";
import { useCart } from "../components/CotextoCarrito";
import Swal from "sweetalert2";
import { getUserId } from "../services/AuthService";
import { verificarCarritoParaLimpiar } from "../services/CarritoService";

export async function loader() {
    try {
        const productos = await obtenerProductos();
        return productos || [];
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
}

const categorias = [
    { nombre: "Alimentos para Perros", imagen: "/img/descarga.jpg", id_categoria: 1 },
    { nombre: "Alimentos para Gatos", imagen: "/img/alimento_gatos.jpg", id_categoria: 5 },
    { nombre: "Alimentos para Peces", imagen: "/img/alimento_peces.jpg", id_categoria: 7 },
    { nombre: "Alimentos para Aves", imagen: "/img/alimentos_aves.jpg", id_categoria: 6 },
    { nombre: "Pet Shop", imagen: "/img/petshop.png", id_categoria: 3 },
];

// Flecha personalizada para el carrusel
const Arrow = ({ style, onClick, direction }: any) => (
    <button
        className={`absolute top-1/2 z-10 -translate-y-1/2 bg-violet-600 text-white rounded-full p-2 shadow-lg hover:bg-violet-800 transition ${direction === "left" ? "left-0" : "right-0"}`}
        style={{ ...style }}
        onClick={onClick}
        aria-label={direction === "left" ? "Anterior" : "Siguiente"}
        type="button"
    >
        {direction === "left" ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
    </button>
);

const Inicio: React.FC = () => {
    const data = useLoaderData() as Productos[] || [];
    const navigate = useNavigate();
    const [mensajeIndex, setMensajeIndex] = useState(0);
    const { limpiarCarrito } = useCart();

    // Función para forzar la limpieza del carrito
    const forzarLimpiezaCarrito = () => {
        console.log('🧹 Ejecutando forzar limpieza del carrito...');

        // 1. Limpiar usando el contexto
        try {
            limpiarCarrito();
            console.log('✅ Función limpiarCarrito() ejecutada');
        } catch (error) {
            console.error('❌ Error al ejecutar limpiarCarrito():', error);
        }

        // 2. Forzar limpieza en localStorage para todos los usuarios posibles
        const currentUser = localStorage.getItem('userName');
        if (currentUser) {
            console.log(`👤 Limpiando carrito para usuario: ${currentUser}`);
            const carritoKey = `carrito_${currentUser}`;
            localStorage.removeItem(carritoKey);
            localStorage.setItem(carritoKey, JSON.stringify([]));
        }

        // 3. Limpiar cualquier carrito que pueda estar en localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('carrito_')) {
                console.log(`🗑️ Removiendo completamente: ${key}`);
                localStorage.removeItem(key);
                console.log(`✅ Carrito removido: ${key}`);
            }
        });

        // 4. Trigger manual del evento para asegurar que se ejecute
        window.dispatchEvent(new Event('cart-cleared'));
        console.log('📡 Evento cart-cleared disparado');

        // 5. Forzar actualización del DOM
        setTimeout(() => {
            window.dispatchEvent(new Event('storage'));
            console.log('📡 Evento storage disparado');
            
            // Verificación final
            const carritosRestantes = Object.keys(localStorage).filter(key => key.startsWith('carrito_'));
            console.log('🔍 Verificación final - carritos restantes:', carritosRestantes);
        }, 100);

        console.log('🎯 Limpieza del carrito completada');
    };

    // Cambiar el mensaje de recomendación cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setMensajeIndex(prev => (prev + 1) % recomendaciones.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Detectar pago exitoso al cargar la página
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment_status') || urlParams.get('status') || urlParams.get('payment');
        const clearCart = urlParams.get('clearCart');
        const collectionStatus = urlParams.get('collection_status');
        const preferenceId = urlParams.get('preference-id');

        console.log('🔍 Verificando parámetros de pago:', {
            paymentStatus,
            clearCart,
            collectionStatus,
            preferenceId,
            allParams: Object.fromEntries(urlParams.entries())
        });

        // Detectar pago exitoso por varios parámetros posibles
        const isPaymentSuccess = paymentStatus === 'success' ||
            paymentStatus === 'approved' ||
            collectionStatus === 'approved' ||
            (preferenceId && window.location.pathname === '/'); // Si viene de MP con preference-id a la raíz

        // También detectar si viene del referrer de Mercado Pago
        const comeFromMercadoPago = document.referrer.includes('mercadopago.com') ||
            document.referrer.includes('mercadolibre.com');

        console.log('🔍 Información adicional:', {
            referrer: document.referrer,
            comeFromMercadoPago,
            pathname: window.location.pathname,
            href: window.location.href
        });

        if (isPaymentSuccess || (comeFromMercadoPago && (preferenceId || window.location.pathname === '/'))) {
            // Limpiar el carrito después del pago exitoso
            console.log('🎉 Pago exitoso detectado, limpiando carrito...');
            forzarLimpiezaCarrito();

            // Mostrar mensaje de éxito
            Swal.fire({
                title: '¡Pago exitoso!',
                text: 'Tu compra ha sido procesada correctamente. El stock se ha actualizado automáticamente.',
                icon: 'success',
                confirmButtonColor: '#7c3aed',
                timer: 4000,
                showConfirmButton: true
            }).then(() => {
                // Asegurarse de que el carrito esté limpio después de mostrar el mensaje
                console.log('🧹 Ejecutando limpieza adicional del carrito...');
                forzarLimpiezaCarrito();
            });

            // Limpiar los parámetros de la URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'failure') {
            Swal.fire({
                title: 'Pago fallido',
                text: 'Hubo un problema con tu pago. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonColor: '#7c3aed'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'pending') {
            Swal.fire({
                title: 'Pago pendiente',
                text: 'Tu pago está siendo procesado. Te notificaremos cuando esté completado.',
                icon: 'info',
                confirmButtonColor: '#7c3aed'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Verificación adicional de limpieza automática por pago exitoso
    useEffect(() => {
        const verificarLimpiezaEnInicio = async () => {
            const clienteId = getUserId();
            if (clienteId) {
                try {
                    console.log('🏠 Verificando limpieza de carrito en página de inicio...');
                    const resultado = await verificarCarritoParaLimpiar(clienteId);
                    
                    if (resultado.limpiarCarrito) {
                        console.log(`🎉 Pago exitoso detectado en inicio: ${resultado.pagoId}`);
                        forzarLimpiezaCarrito();
                        
                        Swal.fire({
                            title: '¡Pago exitoso!',
                            text: 'Tu compra ha sido procesada correctamente. El stock se ha actualizado automáticamente.',
                            icon: 'success',
                            confirmButtonColor: '#7c3aed',
                            timer: 4000,
                            showConfirmButton: true
                        });
                    }
                } catch (error) {
                    console.error('❌ Error al verificar limpieza en inicio:', error);
                }
            }
        };

        // Verificar inmediatamente al cargar la página de inicio
        verificarLimpiezaEnInicio();
    }, []);

    const handleCategoriaClick = (id_categoria: number) => {
        navigate(`/productos?categoria=${id_categoria}`);
    };

    const banners = [
        { src: "/img/banner1.png", alt: "" },
        { src: "/img/banner2.jpg", alt: "" },
        { src: "/img/banner3.png", alt: "" },
        { src: "/img/banner4.jpg", alt: "" },
        { src: "/img/banner5.png", alt: "" },
        { src: "/img/banner6.jpg", alt: "" },
        { src: "/img/banner7.jpg", alt: "" },
        { src: "/img/banner8.jpg", alt: "" },
        { src: "/img/banner9.jpg", alt: "" },
    ];

    // Configuración del carrusel de banners
    const bannerSettings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } }
        ]
    };

    // Mensaje de notificación visual
    const recomendaciones = [
        "¡No olvides vacunar a tu mascota! Consultá el calendario en la veterinaria.",
        "Recuerda desparasitar a tu mascota cada 3 meses.",
        "¡Dale mucho amor y ejercicio a tu mascota todos los días!",
        "Visita al veterinario al menos una vez al año para un chequeo general.",
        "Mantén siempre agua fresca disponible para tu mascota."
    ];


    // Configuración del carrusel con flechas personalizadas
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true, // <-- Activa el movimiento automático
        autoplaySpeed: 2000, // <-- Cada 2 segundos
        nextArrow: <Arrow direction="right" />,
        prevArrow: <Arrow direction="left" />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <section className="container mx-auto px-6 py-8 mt-8 pt-5">
            {/* Carrusel de banners de marketing */}
            <div className="mb-12">
                <Slider {...bannerSettings}>
                    {banners.map((banner) => (
                        <div key={banner.src}>
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                className="w-full h-48 md:h-64 object-contain bg-white rounded-xl shadow-lg"
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <h1 className="text-4xl font-bold text-center mb-4 text-violet-700">Nuestras Categorías</h1>
            <p className="text-center text-lg text-gray-600 mb-10">
                Elegí una categoría para ver todos los productos disponibles
            </p>
            <div className="flex justify-center gap-6 mb-10 flex-wrap">
                {categorias.map(cat => (
                    <button
                        key={cat.id_categoria}
                        onClick={() => handleCategoriaClick(cat.id_categoria)}
                        className="flex flex-col items-center bg-white rounded shadow transition-all duration-300 hover:scale-105 hover:shadow-2xl p-6 w-56"
                    >
                        <img src={cat.imagen} alt={cat.nombre} className="w-36 h-36 object-cover rounded-full mb-4" />
                        <span className="font-semibold">{cat.nombre}</span>
                    </button>
                ))}
                {/* Notificación visual de vacunación */}
                <div className="flex justify-center mb-10">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded shadow-lg flex items-center gap-3 animate-bounce">
                        <FaBell className="text-yellow-500 text-xl" />
                        <span className="font-semibold">
                            {recomendaciones[mensajeIndex]}
                        </span>
                    </div>
                </div>


            </div>
            <h1 className="text-4xl font-bold text-center mb-4 text-violet-700">Más Productos</h1>
            <p className="text-center text-lg text-gray-600 mb-10">
                Accede a tu compra de forma rápida y sencilla.
            </p>
            <Slider {...settings}>
                {data.slice(0, 20).map((producto) => (
                    <div key={producto.id_producto} className="px-2">
                        <InicioProductDetalle producto={producto} />
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default Inicio;
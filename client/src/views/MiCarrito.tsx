import { Link } from "react-router-dom";
import { useCart } from "../components/CotextoCarrito";
import PerfilCarrito from "../components/PerfilCarrito";
import { formatCurrency } from "../helpers";
import { getUserName, getUserId } from "../services/AuthService";
import { useState, useEffect } from "react";


declare global {
    interface Window {
        MercadoPago: any;
    }
}

interface MiCarritoProps {
    onClose: () => void;
}

const MiCarrito: React.FC<MiCarritoProps> = ({ onClose }) => {
    const { carrito } = useCart();
    const [nombre, setNombre] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [retiro, setRetiro] = useState("sucursal"); // "central" o "sucursal"
    const [retiroSucursal, setRetiroSucursal] = useState(false); // Estado para el checkbox
    const [enviando, setEnviando] = useState(false);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [paymentInProgress, setPaymentInProgress] = useState(false); // Nuevo estado para tracking de pago
    const [paymentStartTime, setPaymentStartTime] = useState<number | null>(null); // Timestamp de cuando se inició el pago

    useEffect(() => {
        const nombreUsuario = getUserName();
        setNombre(nombreUsuario);
        setUserId(getUserId());

        // Obtener la Public Key de Mercado Pago
        const getPublicKey = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/mp-public-key");
                if (response.ok) {
                    const data = await response.json();
                    setPublicKey(data.public_key);
                }
            } catch (error) {
                console.error("Error obteniendo public key:", error);
            }
        };

        getPublicKey();
    }, []);

    // Detectar cuando el usuario vuelve a la pestaña después de un pago O verificar pagos periódicamente
    useEffect(() => {
        let pollingInterval: number | null = null;

        const handleVisibilityChange = () => {
            if (!document.hidden && paymentInProgress) {
                console.log("Usuario volvió a la pestaña, verificando estado del carrito...");

                // Pequeño delay para asegurar que el webhook se procesó
                setTimeout(() => {
                    // Verificar si el carrito se vació (señal de pago exitoso)
                    const currentCartSize = carrito.length;
                    console.log("Tamaño actual del carrito:", currentCartSize);

                    // Si había items y ahora está vacío, o si verificamos externamente
                    if (currentCartSize === 0 && paymentInProgress) {
                        console.log("Carrito vacío detectado, recargando página...");
                        setPaymentInProgress(false);
                        window.location.reload();
                    } else {
                        // Verificar con el servidor si hay un pago reciente para este usuario
                        checkRecentPayment();
                    }
                }, 2000); // 2 segundos de delay
            }
        };

        const checkRecentPayment = async () => {
            try {
                // Buscar pagos desde que se inició el proceso de pago actual
                // El servidor agregará 30 segundos automáticamente para evitar detección prematura
                const timestamp = paymentStartTime || Date.now() - 2 * 60 * 1000;
                console.log(`🔍 Verificando pagos desde timestamp: ${new Date(timestamp).toISOString()}`);

                const response = await fetch(`http://localhost:4000/api/verificar-pago-reciente/${userId}?since=${timestamp}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.paymentFound) {
                        console.log("🎉 Pago reciente encontrado, limpiando carrito y recargando...");
                        setPaymentInProgress(false);
                        setPaymentStartTime(null);

                        // Limpiar carrito del localStorage usando la clave correcta
                        if (nombre) {
                            const carritoKey = `carrito_${nombre}`;
                            localStorage.removeItem(carritoKey);
                            console.log(`🧹 Carrito limpiado: ${carritoKey}`);
                        }

                        // También limpiar la clave genérica por si acaso
                        localStorage.removeItem('carrito');

                        // Mostrar mensaje de éxito
                        alert("¡Pago procesado exitosamente! Tu pedido ha sido registrado.");

                        // Recargar la página para mostrar carrito vacío
                        window.location.reload();
                    } else {
                        console.log("❌ No se encontraron pagos recientes");
                    }
                } else {
                    console.log("Error en la respuesta del servidor");
                }
            } catch (error) {
                console.log("Error verificando pago reciente:", error);
            }
        };        // 🆕 NUEVA FUNCIONALIDAD: Polling para pagos en misma pestaña
        if (paymentInProgress) {
            console.log("💡 Iniciando polling para detectar pagos en misma pestaña...");

            // ESPERAR 60 SEGUNDOS antes de empezar a hacer polling (tiempo suficiente para completar pago)
            const delayTimeout = setTimeout(() => {
                console.log("⏰ Iniciando polling después del delay de 60 segundos...");

                pollingInterval = setInterval(() => {
                    console.log("🔍 Verificando pago (polling)...");
                    checkRecentPayment();
                }, 5000); // Verificar cada 5 segundos
            }, 15000); // Esperar 15 segundos antes de empezar

            // También configurar un timeout para resetear después de 5 minutos
            const resetTimeout = setTimeout(() => {
                console.log("⏰ Timeout de pago alcanzado, reseteando estado...");
                setPaymentInProgress(false);
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                }
            }, 5 * 60 * 1000); // 5 minutos

            // Limpiar timeouts si el componente se desmonta
            return () => {
                clearTimeout(delayTimeout);
                clearTimeout(resetTimeout);
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                }
            };
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [paymentInProgress, carrito.length, userId]);

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => total + producto.precio_venta * producto.cantidad, 0);
    };

    const handlePagar = async () => {
        if (carrito.length === 0) return;
        setLoading(true);

        // Establecer timestamp de inicio del pago ANTES de activar tracking
        const startTime = Date.now();
        setPaymentStartTime(startTime);
        setPaymentInProgress(true); // Activar tracking de pago

        console.log("Iniciando proceso de pago, activando tracking con timestamp:", startTime);

        const items = carrito.map(producto => ({
            id: producto.id_producto,
            title: producto.descripcion,
            quantity: producto.cantidad,
            unit_price: producto.precio_venta,
            description: producto.descripcion,
        }));

        // Crear external_reference con datos del carrito
        const carritoData = carrito.map(p => ({ id: p.id_producto, qty: p.cantidad }));
        const external_reference = `pedido_${Date.now()}_cliente_${userId}_carrito_${btoa(JSON.stringify(carritoData))}`;

        try {
            const response = await fetch("http://localhost:4000/api/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    retiro,
                    id_cliente: userId,
                    external_reference,
                    carrito_backup: carritoData // backup adicional
                }),
            });

            if (!response.ok) throw new Error("Error al crear la preferencia de pago");

            const data = await response.json();
            setLoading(false);

            if (data.id && publicKey) {
                try {
                    // 🚀 ABRIR MERCADO PAGO EN NUEVA VENTANA (POPUP)
                    const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
                    console.log("🔗 Abriendo checkout en nueva ventana:", checkoutUrl);

                    // Abrir en nueva ventana popup para mantener la página original
                    const popup = window.open(
                        checkoutUrl,
                        'mercadopago-checkout',
                        'width=800,height=600,scrollbars=yes,resizable=yes,centerscreen=yes'
                    );

                    // Opcional: Enfocar la ventana popup si el navegador lo permite
                    if (popup) {
                        popup.focus();
                    } else {
                        // Si no se pudo abrir popup (bloqueado), usar redirección normal
                        console.log("Popup bloqueado, usando redirección normal");
                        window.location.href = checkoutUrl;
                    }
                } catch (mpError) {
                    console.warn("Error de MercadoPago:", mpError);
                    setPaymentInProgress(false);
                    alert("Error al abrir el pago. Intenta nuevamente.");
                }
            } else {
                setPaymentInProgress(false); // Desactivar tracking si falla
                if (!publicKey) {
                    alert("Error de configuración. Public Key no disponible.");
                } else {
                    alert("No se pudo iniciar el pago. Intenta nuevamente.");
                }
            }
        } catch (error) {
            setLoading(false);
            setPaymentInProgress(false); // Desactivar tracking si hay error
            alert("Ocurrió un error al procesar el pago.");
            console.error(error);
        }
    };

    // Descargar remito como PDF
    const handleDescargarRemito = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para descargar el remito.");
            return;
        }

        // 🔍 DEBUG: Verificar el token
        console.log("🔑 Token encontrado:", token ? "Sí" : "No");
        console.log("🔑 Primeros caracteres del token:", token ? token.substring(0, 20) + "..." : "N/A");

        try {
            console.log("📄 Enviando solicitud de descarga de remito...");
            const response = await fetch("http://localhost:4000/api/descargar-remito", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre,
                    retiro,
                    carrito,
                    total: calcularTotal()
                }),
            });

            console.log("📄 Respuesta del servidor:", response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error del servidor:", errorText);

                // Si es error 401, sugerir relogin
                if (response.status === 401) {
                    alert("Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.");
                    return;
                }

                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "remito.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            console.log("✅ Remito descargado exitosamente");

            // 🧹 Limpiar carrito después de generar remito exitosamente
            if (nombre) {
                const carritoKey = `carrito_${nombre}`;
                localStorage.removeItem(carritoKey);
                console.log(`🧹 Carrito limpiado después de descargar remito: ${carritoKey}`);
            }
            // También limpiar la clave genérica por si acaso
            localStorage.removeItem('carrito');

            // Mostrar mensaje de éxito y recargar
            alert("¡Remito descargado exitosamente! Tu pedido ha sido procesado.");
            window.location.reload();
        } catch (error) {
            console.error("❌ Error completo:", error);
            alert(`Error al descargar el remito: ${error}`);
        }
    };

    // Enviar remito por email (requiere endpoint en backend)
    const handleEnviarRemito = async () => {
        setEnviando(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Debes iniciar sesión para enviar el remito.");
                setEnviando(false);
                return;
            }

            // 🔍 DEBUG: Verificar el token
            console.log("� Token encontrado:", token ? "Sí" : "No");
            console.log("🔑 Primeros caracteres del token:", token ? token.substring(0, 20) + "..." : "N/A");

            console.log("�📧 Enviando solicitud de remito por email...");
            const response = await fetch("http://localhost:4000/api/enviar-remito", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre,
                    retiro,
                    carrito,
                    total: calcularTotal()
                }),
            });

            console.log("📧 Respuesta del servidor:", response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error del servidor:", errorText);

                // Si es error 401, sugerir relogin
                if (response.status === 401) {
                    alert("Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.");
                    setEnviando(false);
                    return;
                }

                throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log("✅ Respuesta exitosa:", result);

            // 🧹 Limpiar carrito después de enviar remito exitosamente
            if (nombre) {
                const carritoKey = `carrito_${nombre}`;
                localStorage.removeItem(carritoKey);
                console.log(`🧹 Carrito limpiado después de enviar remito: ${carritoKey}`);
            }
            // También limpiar la clave genérica por si acaso
            localStorage.removeItem('carrito');

            alert("¡Remito enviado por email correctamente! Tu pedido ha sido procesado.");

            // Recargar página para mostrar carrito vacío
            window.location.reload();
        } catch (error) {
            console.error("❌ Error completo:", error);
            alert(`Error al enviar el remito por email: ${error}`);
        }
        setEnviando(false);
    };

    return (
        <div
            className="relative max-w-lg mx-auto mt-20 w-full border border-gray-400 rounded-lg bg-white shadow-lg overflow-hidden"
            style={{ maxHeight: '90vh' }}
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
        >
            {/* Todo el contenido con scroll */}
            <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>
                {/* Header del modal */}
                <div className="flex justify-between items-center p-6 border-b bg-white">
                    <h2 className="text-xl font-bold text-gray-800">
                        {carrito.length === 0 ? `Hola ${nombre}!` : `Hola ${nombre}! (${carrito.length} ${carrito.length === 1 ? 'producto' : 'productos'})`}
                    </h2>
                    <button
                        onClick={() => {
                            onClose();
                        }}
                        className="text-gray-600 transition duration-300 hover:text-red-600"
                        title="Cerrar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido principal */}
                <div className="px-6 py-4">
                    {carrito.length === 0 ? (
                        <p className="text-center text-xl font-bold text-gray-800">Tu carrito está vacío</p>
                    ) : (
                        <>
                            <p className="text-center mb-4">
                                Estos son tus productos seleccionados
                            </p>

                            {/* Selección de retiro SOLO si hay productos */}
                            <div className="mb-6">
                                <label className="block font-semibold mb-3 text-gray-700">Opciones de compra</label>
                                <div className="space-y-3">
                                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={retiroSucursal}
                                            onChange={(e) => {
                                                setRetiroSucursal(e.target.checked);
                                                if (e.target.checked) {
                                                    setRetiro("sucursal");
                                                }
                                            }}
                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <div>
                                            <span className="text-gray-800 font-medium">Retiro en Sucursal L.N Alem</span>
                                            <p className="text-sm text-gray-600">
                                                Selecciona para retirar en sucursal y generar remito
                                            </p>
                                        </div>
                                    </label>

                                    <div className="text-sm text-gray-500 italic ml-7">
                                        💡 Con retiro en sucursal puedes descargar o enviar remito por email
                                    </div>
                                </div>
                            </div>

                            {carrito.map((producto) => (
                                <div key={producto.id_producto}>
                                    <PerfilCarrito producto={producto} />
                                </div>
                            ))}

                            <div className="mt-6 flex justify-between items-center border-t pt-4">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-lg font-semibold">{formatCurrency(calcularTotal())}</span>
                            </div>

                            <div className="mt-4 text-center">
                                <span className={`inline-block px-4 py-2 rounded-lg text-base font-semibold shadow-sm border ${retiroSucursal
                                    ? "bg-green-100 border-green-300 text-green-800"
                                    : "bg-yellow-100 border-yellow-300 text-yellow-800"
                                    }`}>
                                    {retiroSucursal
                                        ? "✅ Retiro en Sucursal L.N Alem seleccionado"
                                        : "⚠️ Selecciona retiro en sucursal para opciones de remito"}
                                </span>
                            </div>

                            {/* Indicador de pago en progreso */}
                            {paymentInProgress && (
                                <div className="mt-4 text-center">
                                    <div className="inline-block bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
                                            <span>🔄 Esperando confirmación de pago...</span>
                                        </div>
                                        <div className="text-xs mt-1 text-blue-600">
                                            El carrito se actualizará automáticamente cuando regreses de Mercado Pago
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Botones siempre dentro del área de scroll */}
                <div className="px-6 py-4 border-t bg-white">
                    <div className="space-y-4 text-center">
                        {/* Botón de Mercado Pago - Se deshabilita si se selecciona retiro en sucursal */}
                        <button
                            disabled={carrito.length === 0 || loading || retiroSucursal}
                            onClick={handlePagar}
                            className={`w-full rounded px-4 py-3 text-sm font-medium text-white transition ${carrito.length > 0 && !retiroSucursal
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {retiroSucursal
                                ? "Pago online no disponible con retiro en sucursal"
                                : loading ? "Cargando..." : "Pagar con Mercado Pago"
                            }
                        </button>

                        {/* Separador visual */}
                        {retiroSucursal && (
                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="px-3 text-sm text-gray-500 bg-white">Opciones de remito</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                        )}

                        {/* Botón descargar remito - Solo habilitado si se selecciona retiro en sucursal */}
                        <button
                            disabled={carrito.length === 0 || !retiroSucursal}
                            onClick={handleDescargarRemito}
                            className={`w-full rounded px-4 py-3 text-sm font-medium border transition ${carrito.length > 0 && retiroSucursal
                                ? "text-blue-700 border-blue-700 bg-white hover:bg-blue-50"
                                : "text-gray-400 border-gray-300 bg-gray-50 cursor-not-allowed"
                                }`}
                        >
                            {!retiroSucursal
                                ? "📄 Descargar remito (requiere retiro en sucursal)"
                                : "📄 Descargar remito (PDF)"
                            }
                        </button>

                        {/* Botón enviar remito por email - Solo habilitado si se selecciona retiro en sucursal */}
                        <button
                            disabled={carrito.length === 0 || enviando || !retiroSucursal}
                            onClick={handleEnviarRemito}
                            className={`w-full rounded px-4 py-3 text-sm font-medium border transition ${carrito.length > 0 && retiroSucursal
                                ? "text-green-700 border-green-700 bg-white hover:bg-green-50"
                                : "text-gray-400 border-gray-300 bg-gray-50 cursor-not-allowed"
                                }`}
                        >
                            {!retiroSucursal
                                ? "📧 Enviar remito por email (requiere retiro en sucursal)"
                                : enviando ? "Enviando..." : "📧 Enviar remito por email"
                            }
                        </button>

                        <Link
                            to={"/"}
                            onClick={() => {
                                onClose();
                            }}
                            className="inline-block text-sm text-gray-500 underline transition hover:text-gray-600"
                        >
                            Continuar comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiCarrito;
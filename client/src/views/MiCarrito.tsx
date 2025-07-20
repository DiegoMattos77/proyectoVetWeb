import { Link } from "react-router-dom";
import { useCart } from "../components/CotextoCarrito";
import PerfilCarrito from "../components/PerfilCarrito";
import { formatCurrency } from "../helpers";
import { getUserName, getUserId } from "../services/AuthService";
import { useState, useEffect, useRef } from "react";


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
    const mpButtonRef = useRef<HTMLDivElement>(null);

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
            }, 30000); // Esperar 60 segundos antes de empezar

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

    // Limpia el botón de Mercado Pago al desmontar o cerrar
    useEffect(() => {
        return () => {
            if (mpButtonRef.current) mpButtonRef.current.innerHTML = "";
        };
    }, []);

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

            if (data.id && window.MercadoPago && publicKey) {
                if (mpButtonRef.current) mpButtonRef.current.innerHTML = "";

                try {
                    const mp = new window.MercadoPago(publicKey, { locale: "es-AR" });
                    mp.checkout({
                        preference: { id: data.id },
                        render: {
                            container: ".mp-button",
                            label: "Pagar con Mercado Pago",
                        },
                    });
                } catch (mpError) {
                    // Silenciar errores de tracking/analytics de MercadoPago
                    console.warn("Error de MercadoPago (no crítico):", mpError);
                    // El botón de pago debería seguir funcionando
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
        try {
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
            if (!response.ok) throw new Error("No se pudo descargar el remito.");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "remito.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Error al descargar el remito.");
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
            if (!response.ok) throw new Error("No se pudo enviar el remito.");
            alert("Remito enviado por email correctamente.");
        } catch (error) {
            alert("Error al enviar el remito por email.");
        }
        setEnviando(false);
    };

    return (
        <div
            className="relative max-w-lg mx-auto mt-20 w-full border border-gray-400 rounded-lg bg-white shadow-lg px-6 py-10"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
        >
            <button
                onClick={() => {
                    if (mpButtonRef.current) mpButtonRef.current.innerHTML = "";
                    onClose();
                }}
                className="absolute top-4 right-4 text-gray-600 transition duration-300 hover:text-red-600"
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

            {carrito.length === 0 ? (
                <>
                    <div>
                        <p className="text-center text-3xl font-bold tracking-tight text-blue-500 mb-2">Hola {nombre}!</p>
                    </div>
                    <p className="text-center text-xl font-bold text-gray-800">Tu carrito está vacío</p>
                </>
            ) : (
                <>
                    <p className="text-center">
                        <span className="text-xl text-blue-700">Hola {nombre}!</span> Estos son tus productos seleccionados
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
                                        // Si se marca el checkbox, forzamos retiro = "sucursal"
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

            <div className="space-y-4 text-center mt-6">
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
                {/* Aquí se renderiza el botón de Mercado Pago */}
                <div ref={mpButtonRef} className="mt-2 mp-button"></div>
                <Link
                    to={"/"}
                    onClick={() => {
                        if (mpButtonRef.current) mpButtonRef.current.innerHTML = "";
                        onClose();
                    }}
                    className="inline-block text-sm text-gray-500 underline transition hover:text-gray-600"
                >
                    Continuar comprando
                </Link>
            </div>
        </div>
    );
};

export default MiCarrito;
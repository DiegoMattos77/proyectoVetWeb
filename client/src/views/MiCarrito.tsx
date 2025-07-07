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
    const [retiro, setRetiro] = useState("central"); // "central" o "sucursal"
    const [enviando, setEnviando] = useState(false);
    const mpButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nombreUsuario = getUserName();
        setNombre(nombreUsuario);
        setUserId(getUserId());
    }, []);

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

        const items = carrito.map(producto => ({
            id: producto.id_producto,
            title: producto.descripcion,
            quantity: producto.cantidad,
            unit_price: producto.precio_venta,
            description: producto.descripcion,
        }));

        try {
            const response = await fetch("http://localhost:4000/api/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, retiro, id_cliente: userId }),
            });

            if (!response.ok) throw new Error("Error al crear la preferencia de pago");

            const data = await response.json();
            setLoading(false);

            if (data.id && window.MercadoPago) {
                if (mpButtonRef.current) mpButtonRef.current.innerHTML = "";
                const mp = new window.MercadoPago("APP_USR-fa28cccc-92b4-4b93-87c4-e82835b0aee8", { locale: "es-AR" });
                mp.checkout({
                    preference: { id: data.id },
                    render: {
                        container: ".mp-button", // ✅ Esto es un selector CSS válido
                        label: "Pagar con Mercado Pago",
                    },
                });
            } else {
                alert("No se pudo iniciar el pago. Intenta nuevamente.");
            }
        } catch (error) {
            setLoading(false);
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
                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">¿Dónde querés retirar tu compra?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="retiro"
                                    value="central"
                                    checked={retiro === "central"}
                                    onChange={e => setRetiro(e.target.value)}
                                    className="mr-2"
                                />
                                Sucursal Posadas
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="retiro"
                                    value="sucursal"
                                    checked={retiro === "sucursal"}
                                    onChange={e => setRetiro(e.target.value)}
                                    className="mr-2"
                                />
                                Sucursal L.N Alem
                            </label>
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
                        <span className="inline-block bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg text-base font-semibold shadow-sm">
                            Retiro seleccionado: {retiro === "central"
                                ? "Sucursal Posadas"
                                : retiro === "sucursal"
                                    ? "Sucursal L.N Alem"
                                    : "No seleccionado"}
                        </span>
                    </div>
                </>
            )}

            <div className="space-y-4 text-center mt-6">
                <button
                    disabled={carrito.length === 0 || loading}
                    onClick={handlePagar}
                    className={`w-full rounded px-4 py-3 text-sm font-medium text-white transition ${carrito.length > 0 ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {loading ? "Cargando..." : "Pagar con Mercado Pago"}
                </button>
                <button
                    disabled={carrito.length === 0}
                    onClick={handleDescargarRemito}
                    className="w-full rounded px-4 py-3 text-sm font-medium text-blue-700 border border-blue-700 bg-white hover:bg-blue-50 transition"
                >
                    Descargar remito (PDF)
                </button>
                <button
                    disabled={carrito.length === 0 || enviando}
                    onClick={handleEnviarRemito}
                    className="w-full rounded px-4 py-3 text-sm font-medium text-green-700 border border-green-700 bg-white hover:bg-green-50 transition"
                >
                    {enviando ? "Enviando..." : "Enviar remito por email"}
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
import { Link } from "react-router-dom";
import { useCart } from "../components/CotextoCarrito";
import PerfilCarrito from "../components/PerfilCarrito";
import { formatCurrency } from "../helpers";
import { getUserName } from "../services/AuthService";
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
    const [loading, setLoading] = useState(false);
    //const mpButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nombreUsuario = getUserName();
        setNombre(nombreUsuario);
    }, []);

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => total + producto.precio_venta * producto.cantidad, 0);
    };

    const handlePagar = async () => {
        setLoading(true);
        // Llama a tu backend para crear la preferencia
        const response = await fetch("http://localhost:4000/api/mercadopago/crear-preferencia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: carrito }),
        });
        const data = await response.json();
        console.log("Respuesta del backend:", data);
        setLoading(false);

        if (data.id && window.MercadoPago) {
            // Limpia el contenedor antes de renderizar el botón
            const buttonContainer = document.querySelector('.mp-button');
            if (buttonContainer) buttonContainer.innerHTML = "";
            const mp = new window.MercadoPago("TEST-21df7f64-71f8-4f4e-8904-ccaff762b82f", { locale: "es-AR" });
            mp.checkout({
                preference: { id: data.id },
                render: {
                    container: ".mp-button",
                    label: "Pagar con Mercado Pago",
                },
            });
        } else {
            alert("No se pudo iniciar el pago.");
        }
    };

    return (
        <div
            className="relative max-w-lg mx-auto mt-20 w-full border border-gray-400 rounded-lg bg-white shadow-lg px-6 py-10"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
        >
            <button
                onClick={onClose}
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
                    <p className="text-center"><span className="text-xl text-blue-700">Hola {nombre}!</span> Estos son tus productos seleccionados</p>
                    {carrito.map((producto) => (
                        <div key={producto.id_producto}>
                            <PerfilCarrito producto={producto} />
                        </div>
                    ))}
                    <div className="mt-6 flex justify-between items-center border-t pt-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-semibold">{formatCurrency(calcularTotal())}</span>
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
                {/* Aquí se renderiza el botón de Mercado Pago */}
                <div className="mt-2 mp-button"></div>
                <Link
                    to={"/"}
                    onClick={onClose}
                    className="inline-block text-sm text-gray-500 underline transition hover:text-gray-600"
                >
                    Continuar comprando
                </Link>
            </div>
        </div>
    );
};

export default MiCarrito;
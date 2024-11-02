import { Link } from "react-router-dom";
import { useCart } from "../components/CotextoCarrito";
import PerfilCarrito from "../components/PerfilCarrito";
import { formatCurrency } from "../helpers";

interface MiCarritoProps {
    onClose: () => void;
}

const MiCarrito: React.FC<MiCarritoProps> = ({ onClose }) => {
    const { carrito } = useCart();

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => total + producto.precio_venta * producto.cantidad, 0);
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
                <p className="text-center text-xl font-bold text-gray-800">Tu carrito está vacío</p>
            ) : (
                <>
                    {carrito.map((producto) => (
                        <PerfilCarrito key={producto.id_producto} producto={producto} />
                    ))}
                    <div className="mt-6 flex justify-between items-center border-t pt-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-semibold">{formatCurrency(calcularTotal())}</span>
                    </div>
                </>
            )}

            <div className="space-y-4 text-center mt-6">
                <button
                    disabled={carrito.length === 0}
                    className={`w-full rounded px-4 py-3 text-sm font-medium text-white transition ${carrito.length > 0 ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Pagar
                </button>
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

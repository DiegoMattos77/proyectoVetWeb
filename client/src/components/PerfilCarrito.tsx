import React from "react";
import { useCart } from "../components/CotextoCarrito";
import { formatCurrency } from "../helpers";

type CartProfileProps = {
    producto: {
        id_producto: number;
        descripcion: string;
        id_proveedor: number;
        id_categoria: number;
        stock: number;
        precio_venta: number;
        precio_compra: number;
        stock_seguridad: number;
        estado: string;
        imagen: string;
        cantidad: number;
    };
};

const PerfilCarrito: React.FC<CartProfileProps> = ({ producto }) => {
    const { agregarAlCarrito, eliminarDelCarrito } = useCart();

    return (
        <div className="flex items-center gap-4 py-4 border-b">
            <img
                src={`data:image/jpeg;base64,${producto.imagen}`}
                alt={producto.descripcion}
                className="w-20 h-20 rounded object-cover"
            />

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl text-black">{producto.descripcion}</h3>
                        <p className="text-gray-600">Cantidad: <strong>{producto.cantidad}</strong></p>
                    </div>

                    {/* Contenedor de botones alineado a la derecha */}
                    <div className="flex items-center ml-auto space-x-2">
                        <button
                            className="text-gray-600 text-2xl transition duration-300 hover:text-green-600"
                            title="Agregar"
                            onClick={() => agregarAlCarrito(producto)}
                        >
                            <strong>+</strong>
                        </button>
                        <button
                            className="text-gray-600 text-2xl transition duration-300 hover:text-red-600"
                            title="Quitar"
                            onClick={() => eliminarDelCarrito(producto.id_producto)}
                        >
                            <strong>-</strong>
                        </button>
                    </div>
                </div>

                <dl className="mt-1 text-sm text-gray-600">
                    <div>
                        <dt className="inline"><strong>Precio unitario:</strong></dt>
                        <dd className="inline">{formatCurrency(producto.precio_venta)}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default PerfilCarrito;
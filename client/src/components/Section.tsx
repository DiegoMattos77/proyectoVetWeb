import { Productos } from "../types/index";
import { formatCurrency } from "../helpers/index";
import Swal from "sweetalert2";
import { useCart } from "./CotextoCarrito";

type ProductoDetalles = {
    producto: Productos;
};

const InicioProductDetalle = ({ producto }: ProductoDetalles) => {
    const { agregarAlCarrito } = useCart();

    const handleAgree = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        agregarAlCarrito(producto);

        await Swal.fire({
            title: "¡Agregado!",
            text: "El producto se agregó al carrito con éxito",
            icon: "success",
            confirmButtonColor: "#facc15",
            timer: 1500,
            showConfirmButton: false
        });
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
            <div className="overflow-hidden rounded-t-lg h-48 w-full bg-white">
                {producto.imagen ? (
                    <img
                        alt={producto.descripcion}
                        src={`data:image/png;base64,${producto.imagen}`}
                        className="h-full w-full object-contain bg-white p-1 transition-transform duration-300 hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Imagen no disponible</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
                    <p className="font-medium text-lg text-gray-900">{producto.descripcion}</p>
                    <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(producto.precio_venta)}
                    </p>
                </div>

                <form onSubmit={handleAgree} className="mt-4">
                    <button
                        className="w-full bg-violetPalette-btnHover text-white py-2 rounded-lg hover:bg-violetPalette-btnColor transition duration-300"
                        type="submit"
                    >
                        Agregar al Carrito
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InicioProductDetalle;

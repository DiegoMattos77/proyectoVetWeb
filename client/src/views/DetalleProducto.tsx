import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProductoPorId } from "../services/ProductosService";
import { Productos } from "../types/index";
import { useCart } from "../components/CotextoCarrito";
import Swal from "sweetalert2";

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState<Productos | null>(null);
    const [loading, setLoading] = useState(true);
    const [mostrarFAQ, setMostrarFAQ] = useState(false);
    const { agregarAlCarrito } = useCart();

    useEffect(() => {
        if (id) {
            obtenerProductoPorId(id).then((res) => {
                setProducto(res);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="text-center mt-10">Cargando...</div>;
    if (!producto) return <div className="text-center mt-10">Producto no encontrado</div>;

    return (
        <div className="w-full px-0 py-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-violet-700 hover:bg-violet-900 text-white px-5 py-2 rounded-full shadow transition-all"
            >
                Volver
            </button>
            <div className="bg-white rounded shadow p-6 flex flex-col items-center w-full">
                <img
                    src={producto.imagen
                        ? (producto.imagen.startsWith("data:") ? producto.imagen : `data:image/jpeg;base64,${producto.imagen}`)
                        : "/img/no-image.png"}
                    alt={producto.descripcion}
                    className="w-96 h-96 object-contain bg-white rounded mb-6 shadow-lg"
                />
                <h2 className="text-2xl font-bold mb-2">{producto.descripcion}</h2>

                <div className="text-gray-600 mb-2">Stock: {producto.stock}</div>
                <div className="text-xl font-bold text-violet-700 mb-4">${producto.precio_venta}</div>

                {/* Botón de compra */}
                <button
                    onClick={() => {
                        agregarAlCarrito(producto);
                        Swal.fire({
                            title: "¡Agregado!",
                            text: "El producto se agregó al carrito con éxito",
                            icon: "success",
                            confirmButtonColor: "#facc15",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }}
                    className="mb-6 bg-violet-600 hover:bg-violet-800 text-white px-8 py-2 rounded-full shadow transition-all"
                >
                    Agregar al carrito
                </button>

                {/* Bloque comercial */}
                <div className="bg-violet-50 rounded p-4 mb-4 w-full">
                    <h3 className="font-bold text-violet-700 mb-2">¿Por qué elegir este producto?</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Calidad garantizada y frescura en cada entrega.</li>
                        <li>Ideal para el bienestar y nutrición de tu mascota.</li>
                        <li>Envío rápido y seguro a todo el país.</li>
                        <li>Atención personalizada y soporte post-venta.</li>
                    </ul>
                </div>

                {/* Bloque Ideal para */}
                <div className="bg-green-50 rounded p-4 mb-4 w-full">
                    <h3 className="font-bold text-green-700 mb-2">Ideal para</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Animales con necesidades nutricionales especiales</li>
                        <li>Dueños que buscan calidad y confianza</li>
                    </ul>
                </div>

                {/* Bloque Promociones */}
                <div className="bg-yellow-50 rounded p-4 mb-4 w-full">
                    <h3 className="font-bold text-yellow-700 mb-2">¡Promoción especial!</h3>
                    <p className="text-gray-700">Llevá 2 y obtené un 10% de descuento en tu próxima compra.</p>
                </div>

                {/* Bloque Envío y devoluciones */}
                <div className="bg-blue-50 rounded p-4 mb-4 w-full">
                    <h3 className="font-bold text-blue-700 mb-2">Envío y devoluciones</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Envíos a todo el país en 24-48hs</li>
                        <li>Devolución gratuita si tu mascota no está conforme</li>
                    </ul>
                </div>

                {/* Botón de WhatsApp */}
                <button
                    onClick={() => window.open('https://wa.me/549XXXXXXXXXX', '_blank')}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition-all"
                >
                    Consultar por WhatsApp
                </button>

                {/* Solapa Preguntas Frecuentes */}
                <div className="w-full mt-6">
                    <button
                        onClick={() => setMostrarFAQ(!mostrarFAQ)}
                        className="w-full text-left font-bold text-violet-700 bg-violet-100 px-4 py-2 rounded hover:bg-violet-200 transition"
                    >
                        Preguntas Frecuentes {mostrarFAQ ? "▲" : "▼"}
                    </button>
                    {mostrarFAQ && (
                        <div className="bg-white border rounded-b px-4 py-3">
                            <p className="font-semibold mb-1">¿Cuánto tarda el envío?</p>
                            <p className="mb-3 text-gray-700">El envío se realiza en 24 a 48 horas hábiles.</p>
                            <p className="font-semibold mb-1">¿Puedo pagar contra entrega?</p>
                            <p className="mb-3 text-gray-700">Sí, aceptamos pago contra entrega en efectivo.</p>
                            <p className="font-semibold mb-1">¿Qué hago si mi mascota no acepta el producto?</p>
                            <p className="mb-3 text-gray-700">Podés contactarnos y te ayudaremos a encontrar la mejor solución.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;
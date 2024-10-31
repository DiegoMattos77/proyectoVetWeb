import { obtenerProductos } from '../services/ProductosService';
import { useLoaderData } from 'react-router-dom';
import { Productos } from '../types';

export async function loader() {
    try {
        const productos = await obtenerProductos();
        if (!Array.isArray(productos) || productos.length === 0) {
            return [];
        }
        return productos;
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw new Response("Error al obtener los productos", { status: 500 });
    }
}

const Section = () => {
    const productos = useLoaderData() as Productos[] | undefined;

    if (!productos || productos.length === 0) {
        return <p></p>;
    }

    return (
        <section className="text-gray-800 body-font bg-violet-200">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {productos.map((producto) => (
                        <a
                            href="#"
                            key={producto.id_producto}
                            className="block rounded-lg p-4 shadow-sm shadow-indigo-100 lg:w-1/4 md:w-1/2 w-full transform transition hover:scale-105 relative"
                        >
                            <div className="overflow-hidden rounded-md h-56 w-full">
                                <img
                                    alt={producto.descripcion}
                                    src={`data:image/jpeg;base64,${producto.imagen}`}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                            </div>

                            <div className="mt-2 pb-12">
                                <dl>
                                    <div>
                                        <dt className="sr-only">Stock</dt>
                                        <dd className="text-sm text-gray-500">
                                            Stock: {producto.stock}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="sr-only">Descripción</dt>
                                        <dd className="font-medium">{producto.descripcion}</dd>
                                    </div>
                                    <div>
                                        <dt className="sr-only">Precio</dt>
                                        <dd className="font-medium">${producto.precio_venta}</dd>
                                    </div>
                                </dl>

                                <button
                                    className="absolute bottom-4 right-4 bg-violet-500 text-white py-2 px-4 rounded text-sm hover:bg-violet-600 transition"
                                    onClick={() => {/* función para agregar al carrito aquí */ }}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section;

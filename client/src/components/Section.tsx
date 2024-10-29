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
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {productos.map((producto) => (
                        <a
                            href="#"
                            key={producto.id_producto}
                            className="block rounded-lg p-4 shadow-sm shadow-indigo-100 lg:w-1/4 md:w-1/2 w-full"
                        >
                            <img
                                alt={producto.descripcion}
                                src={`data:image/jpeg;base64,${producto.imagen}`}
                                className="h-56 w-full rounded-md object-cover"
                            />

                            <div className="mt-2">
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

                                <div className="mt-6 flex items-center gap-8 text-xs">
                                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                        <svg
                                            className="size-4 text-indigo-700"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                            />
                                        </svg>
                                        <div className="mt-1.5 sm:mt-0">
                                            <p className="text-gray-500">Proveedor</p>
                                            <p className="font-medium">{producto.id_proveedor}</p>
                                        </div>
                                    </div>

                                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                        <svg
                                            className="size-4 text-indigo-700"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                            />
                                        </svg>
                                        <div className="mt-1.5 sm:mt-0">
                                            <p className="text-gray-500">Categoría</p>
                                            <p className="font-medium">{producto.id_categoria}</p>
                                        </div>
                                    </div>

                                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                        <svg
                                            className="size-4 text-indigo-700"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                            />
                                        </svg>
                                        <div className="mt-1.5 sm:mt-0">
                                            <p className="text-gray-500">Estado</p>
                                            <p className="font-medium">{producto.estado}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section;
import { obtenerProductos } from '../services/ProductosService';
import { useLoaderData } from 'react-router-dom';
import { Productos } from '../types';
import { useCart } from './Cart';

// Loader function to fetch products
export async function loader() {
    try {
        const productos = await obtenerProductos();
        return productos || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

const Section = () => {
    const productos = useLoaderData() as Productos[];
    const { addToCart } = useCart();

    if (!productos || productos.length === 0) {
        return <p>Cargando productos...</p>;
    }

    return (
        <section className="text-gray-800 body-font bg-violet-200">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {productos.map((producto) => (
                        <div key={producto.id_producto} className="block rounded-lg p-4 shadow-sm lg:w-1/4 md:w-1/2 w-full relative">
                            <div className="overflow-hidden rounded-md h-56 w-full">
                                {producto.imagen ? (
                                    <img
                                        alt={producto.descripcion}
                                        src={`data:image/jpeg;base64,${producto.imagen}`}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">Imagen no disponible</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 pb-12">
                                <dl>
                                    <div>
                                        <dd className="text-sm text-gray-500">Stock: {producto.stock}</dd>
                                    </div>
                                    <div>
                                        <dd className="font-medium">{producto.descripcion}</dd>
                                    </div>
                                    <div>
                                        <dd className="font-medium">${producto.precio_venta}</dd>
                                    </div>
                                </dl>

                                <button
                                    className="absolute bottom-4 right-4 bg-violet-500 text-white py-2 px-4 rounded text-sm hover:bg-violet-600"
                                    onClick={() => addToCart({
                                        id: producto.id_producto, // ID del producto
                                        nombre: producto.descripcion, // Nombre del producto
                                        precio: producto.precio_venta // Precio del producto
                                    })}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section;

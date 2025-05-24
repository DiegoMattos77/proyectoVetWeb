import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { obtenerProductos } from "../services/ProductosService";
import InicioProductDetalle from "../components/Section";
import { Productos } from "../types/index";
import { useNavigate } from "react-router-dom";

const categorias = [
    { nombre: "Alimentos para Perros", id_categoria: 1 },
    { nombre: "Alimentos para Gatos", id_categoria: 5 },
    { nombre: "Alimentos para Peces", id_categoria: 7 },
    { nombre: "Alimentos para Aves", id_categoria: 4 }
];

const ProductosPage = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<Productos[]>([]);
    const [searchParams] = useSearchParams();
    const busqueda = searchParams.get("busqueda") || "";
    const categoria = searchParams.get("categoria") || "";
    const nombreCategoria = categoria
        ? categorias.find(cat => String(cat.id_categoria) === String(categoria))?.nombre
        : null;

    useEffect(() => {
        // Si hay categoría, pásala a obtenerProductos
        if (categoria) {
            obtenerProductos(undefined, categoria).then(setProductos);
        } else {
            obtenerProductos(busqueda).then(setProductos);
        }
    }, [busqueda, categoria]);

    return (
        <section className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate("/")}
                className="fixed top-28 left-6 z-50 bg-violet-700 hover:bg-violet-900 text-white px-5 py-2 rounded-full shadow-lg transition-all flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                </svg>
                Inicio
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
                {categoria
                    ? `Productos de la categoría "${nombreCategoria || categoria}"`
                    : busqueda
                        ? `Resultados para "${busqueda}"`
                        : "Todos los productos"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        <InicioProductDetalle key={producto.id_producto} producto={producto} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No hay productos para esta búsqueda o categoría.
                    </p>
                )}
            </div>
        </section>
    );
};

export default ProductosPage;
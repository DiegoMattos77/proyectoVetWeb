import React from "react";
import { useLoaderData } from "react-router-dom";
import { obtenerProductos } from "../services/ProductosService";
import InicioProductDetalle from "../components/Section";
import { Productos } from "../types/index";

export async function loader() {
    try {
        const productos = await obtenerProductos();
        return productos || []; // Devuelve un array vacío si no hay productos
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}

const Inicio: React.FC = () => {
    const data = useLoaderData() as Productos[] || []; // Usa array vacío si `data` es undefined

    return (
        <section className="container mx-auto px-4 py-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.length > 0 ? (
                    data.map((producto) => (
                        <InicioProductDetalle key={producto.id_producto} producto={producto} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay productos disponibles</p>
                )}
            </div>
        </section>
    );
};

export default Inicio;

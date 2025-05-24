import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { obtenerProductos } from "../services/ProductosService";
import InicioProductDetalle from "../components/Section";
import { Productos } from "../types/index";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export async function loader() {
    try {
        const productos = await obtenerProductos();
        return productos || [];  
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
}

const categorias = [
    { nombre: "Alimentos para Perros", imagen: "/img/descarga.jpg", id_categoria: 1 },
    { nombre: "Alimentos para Gatos", imagen: "/img/alimento_gatos.jpg", id_categoria: 5 },
    { nombre: "Alimentos para Peces", imagen: "/img/alimento_peces.jpg", id_categoria: 7 },
    { nombre: "Alimentos para Aves", imagen: "/img/alimentos_aves.jpg", id_categoria: 4 }
];

// Flecha personalizada para el carrusel
const Arrow = ({ style, onClick, direction }: any) => (
    <button
        className={`absolute top-1/2 z-10 -translate-y-1/2 bg-violet-600 text-white rounded-full p-2 shadow-lg hover:bg-violet-800 transition ${direction === "left" ? "left-0" : "right-0"}`}
        style={{ ...style }}
        onClick={onClick}
        aria-label={direction === "left" ? "Anterior" : "Siguiente"}
        type="button"
    >
        {direction === "left" ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
    </button>
);

const Inicio: React.FC = () => {
    const data = useLoaderData() as Productos[] || [];
    const navigate = useNavigate();

    const handleCategoriaClick = (id_categoria: number) => {
        navigate(`/productos?categoria=${id_categoria}`);
    };

    // Configuración del carrusel con flechas personalizadas
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <Arrow direction="right" />,
        prevArrow: <Arrow direction="left" />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <section className="container mx-auto px-6 py-8 mt-40 pt-5">
            <h1 className="text-4xl font-bold text-center mb-4 text-violet-700">Nuestras Categorías</h1>
            <p className="text-center text-lg text-gray-600 mb-10">
                Elegí una categoría para ver todos los productos disponibles
            </p>
            <div className="flex justify-center gap-6 mb-10 flex-wrap">
                {categorias.map(cat => (
                    <button
                        key={cat.id_categoria}
                        onClick={() => handleCategoriaClick(cat.id_categoria)}
                        className="flex flex-col items-center bg-white rounded shadow hover:shadow-lg transition p-6 w-56"
                    >
                        <img src={cat.imagen} alt={cat.nombre} className="w-36 h-36 object-cover rounded-full mb-4" />
                        <span className="font-semibold">{cat.nombre}</span>
                    </button>
                ))}
            </div>
            <h1 className="text-4xl font-bold text-center mb-4 text-violet-700">Más Productos</h1>
            <p className="text-center text-lg text-gray-600 mb-10">
                Accede a tu compra y te lo enviamos a casa
            </p>
            <Slider {...settings}>
                {data.slice(0, 20).map((producto) => (
                    <div key={producto.id_producto} className="px-2">
                        <InicioProductDetalle producto={producto} />
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default Inicio;
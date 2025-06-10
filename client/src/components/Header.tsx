import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import LogoVet from "../img/LogoVet.png";
import { getUserName, logout } from "../services/AuthService";
import { useCart } from "./CotextoCarrito";
import MiCarrito from "../views/MiCarrito";
import { obtenerProductos } from "../services/ProductosService";
import { Productos } from "../types/index";
import { FaWhatsapp, FaStore } from "react-icons/fa"; // Agrega este import al inicio
import { FaBookOpen } from "react-icons/fa";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [nombre, setNombre] = useState<string | null>(null);
    const [cartItems] = useState<{ id: number; nombre: string; precio: number }[]>([]);
    const [total, setTotal] = useState(0);
    const { cartCount } = useCart();
    const [busqueda, setBusqueda] = useState("");
    const [sugerencias, setSugerencias] = useState<Productos[]>([]);
    const [mostrarDropdown, setMostrarDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Cerrar menú de cuenta si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isAccountMenuOpen &&
                accountMenuRef.current &&
                !accountMenuRef.current.contains(event.target as Node)
            ) {
                setIsAccountMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isAccountMenuOpen]);

    // Autocompletado: buscar sugerencias mientras se escribe
    useEffect(() => {
        if (busqueda.length === 0) {
            setSugerencias([]);
            setMostrarDropdown(false);
            return;
        }
        const timeout = setTimeout(() => {
            obtenerProductos(busqueda).then(res => {
                setSugerencias(res);
                setMostrarDropdown(true);
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [busqueda]);

    // Al seleccionar una sugerencia
    const handleSugerenciaClick = (producto: Productos) => {
        console.log("Click en sugerencia", producto.id_producto);
        setBusqueda("");
        setMostrarDropdown(false);
        navigate(`/productos/${producto.id_producto}`); // Navega al detalle del producto
    };

    // Cerrar dropdown si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setMostrarDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);




    useEffect(() => {
        const nombreUsuario = getUserName();
        setNombre(nombreUsuario);
    }, []);

    useEffect(() => {
        // Calcular el total cada vez que cambian los elementos del carrito
        const newTotal = cartItems.reduce((acc, item) => acc + item.precio, 0);
        setTotal(newTotal);
    }, [cartItems]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleLogout = () => {
        logout();
        setNombre(null);
        setIsAccountMenuOpen(false);
        window.location.href = "/"
    };

    const handleCheckout = () => {
        console.log("Compra realizada");
        setIsCartOpen(false);
    };



    const openCart = () => setIsCartOpen(true); // Función para abrir el carrito
    const closeCart = () => setIsCartOpen(false); // Función para cerrar el carrito

    return (
        <header className="fixed top-0 left-0 w-full bg-violetPalette-btnColor shadow-lg z-50 m">

            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 h-18">
                <div className="flex h-full items-center justify-between">
                    <div className="md:flex md:items-center md:justify-center md:gap-8 w-24 h-20 md:w-32 md:h-32 mt-2 md:mt-0">
                        <img src={LogoVet} alt="Logo" className="h-24 max-h-full md:h-20 max-w-full object-contain small-logo shadow-md" />
                    </div>

                    <div className="w-full bg-violetPalette-btnColor text-white text-sm flex flex-wrap justify-center items-center gap-8 py-2">
                        {/* Bloque Atención al Cliente */}
                        <div className="flex flex-col items-center bg-violet-800 px-6 py-2 rounded shadow min-w-[180px]">
                            <div className="flex items-center gap-2 mb-1">
                                <FaWhatsapp className="text-green-400 text-xl" />
                                <span className="font-semibold">Atención al Cliente</span>
                            </div>
                            <a
                                href="https://wa.me/3764379723"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-white  hover:text-yellow-400 transition"
                            >
                                +54 3764379723
                            </a>
                        </div>
                        {/* Bloque Nuestros Locales */}
                        <div className="flex flex-col items-center bg-violet-800 px-6 py-2 rounded shadow min-w-[180px]">
                            <div className="flex items-center gap-2 mb-1">
                                <FaStore className="text-yellow-300 text-xl" />
                                <span className="font-semibold">Nuestros Locales</span>
                            </div>
                            <a
                                href="/locales"
                                className="text-lg font-bold text-white underline hover:text-yellow-400 transition"
                            >
                                Ver Locales
                            </a>
                        </div>
                        {/*Bloque Blog de Consejos */}
                        <div className="flex flex-col items-center bg-violet-800 px-6 py-2 rounded shadow min-w-[180px]">
                            <div className="flex items-center gap-2 mb-1">
                                <FaBookOpen className="text-cyan-300 text-xl" />
                                <span className="font-semibold">Blog de Consejos</span>
                            </div>
                            <a
                                href="/blog"
                                className="text-lg font-bold text-white underline hover:text-yellow-400 transition"
                            >
                                Ver Consejos
                            </a>
                        </div>
                    </div>

                    {/* Input de búsqueda con dropdown */}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            if (busqueda.trim() !== "") {
                                navigate(`/productos?busqueda=${encodeURIComponent(busqueda)}`);
                                setMostrarDropdown(false);
                            }
                        }}
                        className="flex mr-4 relative"
                        autoComplete="off"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            name="busqueda" // <-- agrega esto
                            placeholder="Buscar productos..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="rounded-l px-6 py-2 text-black focus:outline-none"
                            onFocus={() => busqueda && setMostrarDropdown(true)}
                        />
                        <button
                            type="submit"
                            className="bg-violet-900 px-4 py-2 rounded-r hover:bg-violet-600 transition text-white"
                        >
                            Buscar
                        </button>
                        {/* Dropdown de sugerencias */}
                        {mostrarDropdown && sugerencias.length > 0 && (
                            <ul className="absolute left-0 right-0 top-full bg-white border rounded shadow z-50 max-h-60 overflow-y-auto w-full">
                                {sugerencias.map(producto => (
                                    <li
                                        key={producto.id_producto}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-violet-100 cursor-pointer"
                                        onMouseDown={() => handleSugerenciaClick(producto)}
                                    >
                                        {/* Imagen del producto */}
                                        <img
                                            src={producto.imagen ?
                                                (producto.imagen.startsWith("data:") ? producto.imagen : `data:image/jpeg;base64,${producto.imagen}`)
                                                : "/img/no-image.png"}
                                            alt={producto.descripcion}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                        {/* Info del producto */}
                                        <div className="flex-1">
                                            <div className="font-semibold">{producto.descripcion}</div>
                                            {/*<div className="text-xs text-gray-500">
                                                Stock {producto.stock}
                                            </div> */}
                                        </div>
                                        {/* Precio */}
                                        <div className="font-bold text-violet-700">${producto.precio_venta}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>


                    <div className="flex items-center gap-4">



                        {/* Login o Mi Cuenta */}
                        {!nombre ? (
                            <div className="sm:flex sm:gap-4">
                                <Link to='/login' className="rounded-md bg-violetPalette-muted px-5 py-2.5 text-sm font-medium text-white shadow">
                                    Login
                                </Link>
                            </div>
                        ) : (
                            <>
                            
                                <button
                                    onClick={openCart}
                                    className="relative rounded-full bg-violetPalette-muted p-1 text-gray-50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-200"
                                >
                                    <FaShoppingCart aria-hidden="true" className="h-6 w-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                                <span className="text-gray-50 text-sm">Bienvenido {nombre}</span>

                                    <div className="relative flex flex-col items-center" ref={accountMenuRef}>
                                    <button
                                        className="text-violetPalette-muted"
                                            onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                                    >
                                        <FaUserCircle size={28} />
                                    </button>
                                    <span className="text-xs text-gray-50">Mi Cuenta</span>

                                    {isAccountMenuOpen && (
                                        <div
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                                        >
                                                <ul className="py-1">
                                                    <li>
                                                        <Link to='/editarme' className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                            Perfil
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Cerrar Sesión
                                                        </button>
                                                    </li>
                                                </ul>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="block md:hidden">
                            <button
                                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                                onClick={toggleMenu}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav aria-label="Mobile" className="md:hidden bg-white w-full absolute top-16 left-0 shadow-lg">
                        <ul className="flex flex-col items-center gap-6 text-sm py-4">
                        </ul>
                    </nav>
                )}

                {/* Modal del carrito */}
                {isCartOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                        <div className="bg-white rounded-md shadow-lg w-80 p-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Carrito de Compras</h2>
                            <ul className="space-y-2">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <li key={item.id} className="text-gray-600">
                                            {item.nombre} - ${item.precio}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-600">El carrito está vacío</li>
                                )}
                            </ul>
                            {cartItems.length > 0 && (
                                <div className="mt-2">
                                    <span className="font-semibold text-gray-700">Total: ${total.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleCheckout}
                                    className="bg-violetPalette-muted text-white px-4 py-2 rounded-md shadow"
                                >
                                    Comprar
                                </button>
                                <button
                                    onClick={toggleCart}
                                    className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {
                isCartOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <MiCarrito onClose={closeCart} /> {/* Pasar onClose al carrito */}
                    </div>
                )
            }
        </header >
    );
};

export default Header;

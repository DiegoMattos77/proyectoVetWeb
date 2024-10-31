import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import LogoVet from '../img/LogoVet.png';
import { getUserName, logout } from "../services/AuthService";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // Estado para el modal del carrito
    const [nombre, setNombre] = useState<string | null>(null);
    const [cartItemsCount, setCartItemsCount] = useState(2); // Ejemplo de cantidad de items

    useEffect(() => {
        const nombreUsuario = getUserName();
        setNombre(nombreUsuario);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleLogout = () => {
        logout();
        setNombre(null);
        setIsAccountMenuOpen(false);
    };

    const handleCheckout = () => {
        // Lógica para proceder a la compra
        console.log("Compra realizada");
        setIsCartOpen(false); // Cierra el modal después de comprar
    };

    return (
        <header className="bg-violet-400">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 h-24">
                <div className="flex h-24 items-center justify-between">
                    <div className="md:flex md:items-center md:justify-center md:gap-12 w-20 h-20 md:w-32 md:h-32 mt-4 md:mt-0">
                        <img src={LogoVet} alt="Logo" className="h-12 max-h-full md:h-16 max-w-full object-contain small-logo" />
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                <li><a className="text-gray-800 transition hover:text-gray-500/75" href="#">About</a></li>
                                <li><a className="text-gray-800 transition hover:text-gray-500/75" href="#">Careers</a></li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Carrito */}
                        <div className="relative">
                            <button
                                className="text-violetPalette-muted flex items-center"
                                onClick={toggleCart}
                            >
                                <FaShoppingCart size={40} />
                                {cartItemsCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 py-0.9 text-xs">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Login o Mi Cuenta */}
                        {!nombre ? (
                            <div className="sm:flex sm:gap-4">
                                <Link to='/login' className="rounded-md bg-violetPalette-muted px-5 py-2.5 text-sm font-medium text-white shadow">
                                    Login
                                </Link>
                            </div>
                        ) : (
                            <>
                                <span className="text-gray-700 text-sm">Bienvenido {nombre}</span>

                                <div className="relative flex flex-col items-center">
                                    <button
                                        className="text-violetPalette-muted"
                                        onClick={toggleAccountMenu}
                                    >
                                        <FaUserCircle size={28} />
                                    </button>
                                    <span className="text-xs text-gray-500">Mi Cuenta</span>

                                    {isAccountMenuOpen && (
                                        <div
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                                        >
                                            <ul className="py-1">
                                                <li><Link to='/editarme' className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Perfil</Link></li>
                                                <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Cerrar Sesión</button></li>
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
                            <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#">About</a></li>
                            <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#">Careers</a></li>
                        </ul>
                    </nav>
                )}

                {/* Modal del carrito */}
                {isCartOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                        <div className="bg-white rounded-md shadow-lg w-80 p-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Carrito de Compras</h2>
                            <ul className="space-y-2">
                                <li className="text-gray-600">Producto 1 - $10</li>
                                <li className="text-gray-600">Producto 2 - $20</li>
                                {/* Agrega más productos aquí */}
                            </ul>
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
        </header>
    );
};

export default Header;

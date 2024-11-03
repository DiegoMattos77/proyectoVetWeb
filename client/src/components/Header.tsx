import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import LogoVet from "../img/LogoVet.png";
import { getUserName, logout } from "../services/AuthService";
import { useCart } from "./CotextoCarrito";
import MiCarrito from "../views/MiCarrito";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [nombre, setNombre] = useState<string | null>(null);
    const [cartItems] = useState<{ id: number; nombre: string; precio: number }[]>([]);
    const [total, setTotal] = useState(0);
    const { cartCount } = useCart();


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


                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                <li><a className="text-gray-50 transition hover:text-gray-500/75" href="#">About</a></li>
                                <li><a className="text-gray-50 transition hover:text-gray-500/75" href="#">Careers</a></li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">

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

import { useState } from "react";
import { Link } from "react-router-dom";
import LogoVet from '../img/LogoVet.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="bg-white">
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 h-24">
                    <div className="flex h-24 items-center justify-between">
                        <div className="md:flex md:items-center md:justify-center md:gap-12 w-20 h-20 md:w-32 md:h-32 mt-4 md:mt-0">
                            <img src={LogoVet} alt="Logo" className="h-12 max-h-full md:h-16 max-w-full object-contain small-logo" />
                        </div>

                        <div className="hidden md:block">
                            <nav aria-label="Global">
                                <ul className="flex items-center gap-6 text-sm">
                                    <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> About </a></li>
                                    <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Careers </a></li>

                                </ul>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">
                                <Link to='/login' className="rounded-md bg-violetPalette-muted px-5 py-2.5 text-sm font-medium text-white shadow">
                                    Login
                                </Link>
                            </div>

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
                                <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> About </a></li>
                                <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Careers </a></li>

                            </ul>
                        </nav>
                    )}
                </div>
            </header>
        </>
    );
}

export default Header;

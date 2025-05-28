import LogoVet from "../img/LogoVet.png";


const Footer = () => {
    return (
        <>
            <footer className="bg-violetPalette-btnColor">

                <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row md:justify-between gap-8">

                    <div className="flex items-center mt-2 md:mt-0">
                        <img src={LogoVet} alt="Logo" className="h-20 object-contain small-logo shadow-md" />
                    </div>

                    {/* Direcciones */}
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-gray-50 mb-2">Locales</span>
                        <span className="text-gray-50 mb-1">
                            <span className="font-semibold">Local Posadas Central :</span><br />
                            Buenos Aires 10955, Posadas, Misiones
                        </span>
                        <span className="text-gray-50 mb-1">
                            <span className="font-semibold">Sucursal Leandro N. Alem:</span><br />
                            Paraná 2730, B1636 Leandro N. Alem, Misiones
                        </span>
                    </div>

                    {/* Enlaces útiles */}
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-gray-50 mb-2">Enlaces Útiles</span>
                        <a className="text-gray-50 transition hover:text-gray-700/75 mb-1" href="/terminos">
                            Términos y Condiciones
                        </a>
                        <a className="text-gray-50 transition hover:text-gray-700/75" href="/preguntas-frecuentes">
                            Preguntas Frecuentes
                        </a>
                    </div>

                    {/* Redes Sociales */}
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-gray-50 mb-2">Redes Sociales</span>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-50 transition hover:text-blue-500"
                                aria-label="Facebook"
                            >
                                {/* Ícono Facebook */}
                                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-50 transition hover:text-pink-500"
                                aria-label="Instagram"
                            >
                                {/* Ícono Instagram */}
                                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/543764379723"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-50 transition hover:text-green-500"
                                aria-label="WhatsApp"
                            >
                                {/* Ícono WhatsApp */}
                                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.26-1.64A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.72.97.99-3.62-.24-.38A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.04 2.81 1.19 3 .15.19 2.05 3.13 5.01 4.27.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.09 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-300 text-sm">
                    © {new Date().getFullYear()} VetWeb. Todos los derechos reservados.
                </div>
            </footer>
        </>
    )
}

export default Footer

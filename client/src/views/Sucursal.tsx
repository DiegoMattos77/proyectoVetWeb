import { useNavigate } from "react-router-dom";
import sucursalvet from "../img/sucursalvet.png";
import { FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Sucursalvet = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-violet-700 mb-4">Sucursal Leandro N. Alem</h1>
            <img
                src={sucursalvet}
                alt="Sucursal Olivos"
                className="w-full max-w-md rounded shadow mb-6 object-cover"
            />
            <div className="w-full mb-4">
                <h2 className="text-xl font-semibold mb-2">Dirección y Contactos</h2>
                <div className="flex items-center gap-2 mb-1">
                    <FaMapMarkerAlt className="text-violet-700" />
                    <span>Paraná 2730, B1636 Leandro N. Alem, Provincia de Misiones</span>
                </div>
                <div className="mb-1">
                    <span className="font-semibold">Horarios:</span> Lunes a Viernes de 10 a 19 y Sábados de 10 a 15.
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <FaEnvelope className="text-violet-700" />
                    <span>contacto@bacanes.com.ar</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <FaWhatsapp className="text-green-500" />
                    <a
                        href="https://wa.me/5491121656429"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-700"
                    >
                        +54 3764379723
                    </a>
                </div>
            </div>
            <a
                href="https://www.google.com/maps/place/Paraná+2730,+B1636+Olivos,+Provincia+de+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-violet-700 hover:bg-violet-900 text-white px-8 py-2 rounded-full shadow transition-all"
            >
                Cómo llegar
            </a>
            <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default Sucursalvet;
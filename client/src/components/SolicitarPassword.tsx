import { useState } from "react";
import { solicitarRecuperacionPassword } from "../services/AuthService";

const SolicitarPassword = () => {
    const [mail, setMail] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await solicitarRecuperacionPassword(mail);
            setMensaje("Si el correo existe, recibirás un enlace para restablecer tu contraseña.");
        } catch (error: any) {
            setMensaje(error.response?.data?.message || "Error al solicitar recuperación.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">¿Olvidaste tu contraseña?</h2>
                <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={mail}
                    onChange={e => setMail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-violetPalette-btnColor text-white py-2 rounded hover:bg-violetPalette-btnHover transition"
                >
                    Enviar enlace
                </button>
                {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
            </form>
        </div>
    );
};

export default SolicitarPassword;
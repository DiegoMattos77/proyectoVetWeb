import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RestablecerPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setMensaje("Token inválido o faltante.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:4000/api/auth/restablecer-password", {
                token,
                newPassword,
            });
            setMensaje(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 3000); // Redirige después de 3 segundos

        } catch (error: any) {
            setMensaje(error.response?.data?.message || "Error al restablecer la contraseña");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-violetPalette-btnColor text-white py-2 rounded hover:bg-violetPalette-btnHover transition"
                >
                    Cambiar contraseña
                </button>
                {mensaje && (
                    <div className="mt-4 text-center">
                        <p>{mensaje}</p>
                        <Link to="/login" className="text-violet-600 underline block mt-2">
                            Ir al login ahora
                        </Link>
                    </div>
                )}
            </form>
        </div>
    );
};

export default RestablecerPassword;
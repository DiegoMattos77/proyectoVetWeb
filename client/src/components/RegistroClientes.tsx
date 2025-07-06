import { useState, useEffect } from "react";
import { Form, ActionFunctionArgs, useActionData, useNavigate } from "react-router-dom";
import { registro } from '../services/ClienteService';
import { Cliente } from '../types/index';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";

type RegistroFormProps = {
    registroCliente?: Cliente;
};

export async function action({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData());
    // Validación de campos vacíos
    if (Object.values(data).some(value => value === "")) {
        return { error: "Todos los campos son obligatorios" };
    }
    // Validación de contraseñas
    if (data.password !== data.confirmPassword) {
        return { error: "Las contraseñas no coinciden" };
    }

    try {
        await registro(data);
        return { success: "¡Registro exitoso!" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error inesperado" };
    }
}

const RegistroClientes = ({ registroCliente }: RegistroFormProps) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const actionData = useActionData() as { error?: string; success?: string };
    const navigate = useNavigate();

    // Mostrar toast y redirigir si corresponde
    useEffect(() => {
        console.log(actionData);
        if (actionData?.error) {
            toast.error(actionData.error, { autoClose: 2000 });
        }

        if (actionData?.success) {
            toast.success(actionData.success, { autoClose: 2000 });
            const timer = setTimeout(() => {
                navigate("/login"); // Redirige al login después de 2 segundos
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [actionData, navigate]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            {/* Botón para volver al inicio */}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-4 bg-violet-700 hover:bg-violet-900 text-white px-5 py-2 rounded-full shadow transition-all"
            >
                Volver al inicio
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-violetPalette-btnColor">Registro de Cliente</h2>
            <Form method="POST">
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        defaultValue={registroCliente?.nombre}
                        name="nombre"
                        id="nombre"
                        type="text"
                        placeholder="Nombre"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        defaultValue={registroCliente?.apellido}
                        name="apellido"
                        id="apellido"
                        type="text"
                        placeholder="Apellido"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Domicilio</label>
                    <input
                        defaultValue={registroCliente?.domicilio}
                        name="domicilio"
                        id="domicilio"
                        type="text"
                        placeholder="Domicilio"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                        defaultValue={registroCliente?.telefono}
                        name="telefono"
                        id="telefono"
                        type="text"
                        placeholder="Teléfono"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        defaultValue={registroCliente?.mail}
                        name="mail"
                        id="mail"
                        type="text"
                        placeholder="Email"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">DNI</label>
                    <input
                        defaultValue={registroCliente?.dni}
                        name="dni"
                        id="dni"
                        type="text"
                        placeholder="DNI"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">CUIT/CUIL</label>
                    <input
                        defaultValue={registroCliente?.cuit_cuil}
                        name="cuit_cuil"
                        id="cuit_cuil"
                        type="text"
                        placeholder="CUIT/CUIL"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Contraseña</label>
                    <div className="relative">
                        <input
                            name="password"
                            id="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Contraseña"
                            className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                            {passwordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Confirmar Contraseña</label>
                    <div className="relative">
                        <input
                            name="confirmPassword"
                            id="confirmPassword"
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="Confirmar Contraseña"
                            className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                            {confirmPasswordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-8 py-3 font-semibold rounded-md bg-violetPalette-btnHover text-white hover:bg-violetPalette-btnColor transition duration-300"
                >
                    Registrarse
                </button>
            </Form>
        </div>
    );
};

export default RegistroClientes;
import { useState } from "react";
import { Form, ActionFunctionArgs, redirect } from "react-router-dom";
import { registro } from '../services/ClienteService'
import { Cliente } from '../types/index';
//import ErrorMsj from "./ErrorMsj";

type RegistroFormProps = {
    registroCliente?: Cliente;
};

export async function action({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData());
    console.log("Datos enviados:", data);
    if (Object.values(data).some(value => value === "")) {
        return "Todos los campos son obligatorios";
    }

    try {
        await registro(data);
        return redirect('/');
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        }
        return "Error inesperado";
    }
}
const RegistroClientes = ({ registroCliente }: RegistroFormProps) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // const error = useActionData() as string;



    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Registro de Cliente</h2>
            <Form method="POST">
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        defaultValue={registroCliente?.nombre}
                        name="nombre"
                        id="nombre"
                        type="text"
                        placeholder="Nombre"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
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
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
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
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
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
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
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
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
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
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
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
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block text-gray-700">Contraseña</label>
                    <input
                        name="password"
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Contraseña"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-600"
                    >
                        {passwordVisible ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-violetPalette-muted text-white py-2.5 rounded-md text-center font-medium"
                >
                    Registrarse
                </button>
            </Form>
        </div>
    );
};

export default RegistroClientes;

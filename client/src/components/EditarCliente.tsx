import { useState } from "react";
import { Form, ActionFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { actualizar, obtenerClienteById } from '../services/ClienteService';
import { Cliente } from '../types/index';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export async function action({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData());
    console.log("Datos enviados:", data);
    if (Object.values(data).some(value => value === "")) {
        return "Todos los campos son obligatorios";
    }

    try {
        const idUsuario = localStorage.getItem('id_cliente');
        if (!idUsuario) throw new Error('No se encontró el ID del cliente');

        const id_cliente = Number(idUsuario);
        const cliente = await actualizar(data, id_cliente);
        console.log(cliente)
        return redirect('/login');
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message;
        }
        return "Error inesperado";
    }
}

export async function loader() {
    try {
        const idUsuario = localStorage.getItem('id_cliente');
        if (!idUsuario) throw new Error('No se encontró el ID del cliente');

        const id_cliente = Number(idUsuario);
        const cliente = await obtenerClienteById(id_cliente);

        if (!cliente) throw new Error('No se pudo encontrar el cliente');
        return cliente;
    } catch (error) {
        console.error("Error al cargar el cliente:", error);
        throw new Error("No se pudo cargar el cliente");
    }
}

const EditarClientes = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const cliente = useLoaderData() as Cliente

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-violetPalette-btnColor ">Editar Perfil</h2>
            <Form method="POST">
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        defaultValue={cliente?.nombre}
                        name="nombre"
                        id="nombre"
                        type="text"
                        placeholder="Nombre"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                    >

                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        defaultValue={cliente?.apellido}
                        name="apellido"
                        id="apellido"
                        type="text"
                        placeholder="Apellido"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                    >
                    </button>
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Domicilio</label>
                    <div className="relative">
                        <input
                            defaultValue={cliente?.domicilio}
                            name="domicilio"
                            id="domicilio"
                            type="text"
                            placeholder="Domicilio"
                            className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                        </button>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Teléfono</label>
                    <div className="relative">
                        <input
                            defaultValue={cliente?.telefono}
                            name="telefono"
                            id="telefono"
                            type="text"
                            placeholder="Teléfono"
                            className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                        </button>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label className="block text-gray-700">Email</label>
                    <div className="relative">
                        <input
                            defaultValue={cliente?.mail}
                            name="mail"
                            id="mail"
                            type="text"
                            placeholder="Email"
                            className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">DNI</label>
                    <input
                        defaultValue={cliente?.dni}
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
                        defaultValue={cliente?.cuit_cuil}
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
                <button
                    type="submit"
                    className="w-full px-8 py-3 font-semibold rounded-md bg-violetPalette-btnHover text-white hover:bg-violetPalette-btnColor transition duration-300"
                >
                    Guardar
                </button>
            </Form>
        </div>
    );
};

export default EditarClientes;

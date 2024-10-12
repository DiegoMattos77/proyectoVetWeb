import { useState } from "react";

const RegistroClientes = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Registro de Cliente</h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        type="text"
                        placeholder="Apellido"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Domicilio</label>
                    <input
                        type="text"
                        placeholder="Domicilio"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                        type="tel"
                        placeholder="Teléfono"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">DNI</label>
                    <input
                        type="text"
                        placeholder="DNI"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">CUIT/CUIL</label>
                    <input
                        type="text"
                        placeholder="CUIT/CUIL"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-violetPalette-muted"
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block text-gray-700">Contraseña</label>
                    <input
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
            </form>
        </div>
    );
};

export default RegistroClientes;

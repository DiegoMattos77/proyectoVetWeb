import { Link, Form, ActionFunctionArgs } from "react-router-dom";
import { login } from '../services/AuthService';
import { LoginCliente } from '../types/index';

import { toast } from "react-toastify"


type LoginFormProps = {
    login?: LoginCliente;
};

export async function action({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData());

    if (Object.values(data).some(value => value === "")) {
        toast.error("Todos los campos son obligatorios");
        return null;
    }

    try {
        await login(data);
        return window.location.href = "/"

    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message);
            return error.message;
        }
        toast.error("Error inesperado");
        return "Error inesperado";
    }
}

const LoginForm = ({ login }: LoginFormProps) => {


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-white text-gray-900 shadow-md">
                <div className="mb-8 text-center">
                    <h1 className="my-3 text-4xl font-bold">Sign in</h1>
                    <p className="text-sm text-gray-600">Inicie sesión para acceder a su cuenta</p>
                </div>
                <Form method="POST">
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm">Nombre de usuario</label>
                            <input
                                defaultValue={login?.mail}
                                type="text"
                                name="mail"
                                id="mail"
                                placeholder="Nombre de usuario"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100 text-gray-900"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm">Contraseña</label>
                                <a href="#" className="text-xs hover:underline text-gray-600">

                                </a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="********"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100 text-gray-900 mb-4"
                            />
                        </div>
                    </div>

                    <p className="px-6 text-sm text-center text-gray-600">
                        <Link to="/solicitar-password" className="hover:underline text-violetPalette-btnColor">
                            ¿Ha olvidado su contraseña?
                        </Link>
                    </p>

                    <div className="space-y-2">
                        <button

                            type="submit"
                            className="w-full px-8 py-3 font-semibold rounded-md bg-violetPalette-btnHover text-white hover:bg-violetPalette-btnColor transition duration-300"
                        >
                            Login
                        </button>

                        <p className="px-6 text-sm text-center text-gray-600">
                            ¿Aún no tienes una cuenta?
                            <Link to="/registrarme" className="hover:underline text-violetPalette-btnColor">
                                Registrarse
                            </Link>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;

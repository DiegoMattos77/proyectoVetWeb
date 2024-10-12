import { Link } from "react-router-dom";


const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-white text-gray-900 shadow-md">
                <div className="mb-8 text-center">
                    <h1 className="my-3 text-4xl font-bold">Sign in</h1>
                    <p className="text-sm text-gray-600">Inicie sesión para acceder a su cuenta</p>
                </div>
                <form noValidate action="" className="space-y-12">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm">Email</label>
                            <input type="email" name="email" id="email" placeholder="mail@mail.com" className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100 text-gray-900" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label htmlFor="password" className="text-sm">Contraseña</label>
                                <a rel="noopener noreferrer" href="#" className="text-xs hover:underline text-gray-600">Has olvidado tu contraseña?</a>
                            </div>
                            <input type="password" name="password" id="password" placeholder="********" className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100 text-gray-900" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <button type="button" className="w-full px-8 py-3 font-semibold rounded-md bg-violetPalette-muted text-white">Sign in</button>
                        </div>
                        <p className="px-6 text-sm text-center text-gray-600">¿Aún no tienes una cuenta?
                            <Link to='/registrarme' rel="noopener noreferrer" className="hover:underline text-violetPalette-muted ">Registrarse</Link>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;

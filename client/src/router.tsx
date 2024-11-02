import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login, { action as actionLogin } from "./components/Login";
import RegistroClientes, { action as actionRegistroClientes } from "./components/RegistroClientes";
import EditarClientes, { action as actionEditarCliente, loader as loaderEditarCliente } from "./components/EditarCliente"
import Inicio, { loader as loaderProductos } from "./views/Inicio";
import MiCarrito from "./views/MiCarrito";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Inicio />,
                loader: loaderProductos
            }
        ],

    },
    {
        path: "/login",
        element: <Login />,
        action: actionLogin
    },
    {
        path: "/registrarme",
        element: <RegistroClientes />,
        action: actionRegistroClientes
    },
    {
        path: "/editarme",
        element: <EditarClientes />,
        action: actionEditarCliente,
        loader: loaderEditarCliente
    },
    {
        path: '/MiCarrito',
        element: <MiCarrito onClose={function (): void {
            throw new Error('Function not implemented.');
        }} />,
    },

]);
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login, { action as actionLogin } from "./components/Login";
import RegistroClientes, { action as actionRegistroClientes } from "./components/RegistroClientes";
import EditarClientes, { action as actionEditarCliente, loader as loaderEditarCliente } from "./components/EditarCliente"
import Section, { loader as loaderproductos } from "./components/Section";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Section />,
                loader: loaderproductos
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

]);
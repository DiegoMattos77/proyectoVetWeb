import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login, { action as actionLogin } from "./components/Login";
import RegistroClientes, { action as actionRegistroClientes } from "./components/RegistroClientes";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,

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
    }
]);
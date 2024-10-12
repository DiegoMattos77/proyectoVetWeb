import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./components/Login";
import RegistroClientes from "./components/RegistroClientes";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/registrarme",
        element: <RegistroClientes />,
    }
]);
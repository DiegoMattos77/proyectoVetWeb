import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login, { action as actionLogin } from "./components/Login";
import RegistroClientes, { action as actionRegistroClientes } from "./components/RegistroClientes";
import EditarClientes, { action as actionEditarCliente, loader as loaderEditarCliente } from "./components/EditarCliente"
import Inicio, { loader as loaderProductos } from "./views/Inicio";
import MiCarrito from "./views/MiCarrito";
import SolicitarPassword from "./components/SolicitarPassword";
import RestablecerPassword from "./components/RestablecerPassword";
import ProductosPage from "./views/Productos";
import DetalleProducto from "./views/DetalleProducto"; // <-- Importa tu componente de detalle
import Sucursalvet from "./views/Sucursal";
import TerminosCondiciones from "./views/TerminosCondiciones";
import PreguntasFrecuentes from "./views/PreguntasFrecuentes";
import Blog from "./views/Blog";
import PaymentConfirmation from "./views/PaymentConfirmation";
import MisFacturas from "./views/MisFacturas";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Inicio />,
                loader: loaderProductos
            },

            {
                path: "/productos",
                element: <ProductosPage />
            },

            {
                path: "/productos/:id", // <-- Nueva ruta para detalle de producto
                element: <DetalleProducto />
            },

            {
                path: "/terminos",
                element: <TerminosCondiciones />
            },

            {
                path: "/preguntas-frecuentes",
                element: <PreguntasFrecuentes />
            },

            {
                path: "/mis-facturas",
                element: <MisFacturas />
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
    {
        path: "/solicitar-password",
        element: <SolicitarPassword />
    },
    {
        path: "/restablecer",
        element: <RestablecerPassword />
    },
    {
        path: "/locales",
        element: <Sucursalvet />
    },
    {
        path: "/blog",
        element: < Blog />
    },
    {
        path: "/payment-confirmation",
        element: <PaymentConfirmation />
    }


]);
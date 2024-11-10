import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { CartProvider } from './components/CotextoCarrito'; // Asegúrate de importar CartProvider
import './index.css';
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </CartProvider>
  </StrictMode>,
);

import { createContext, useContext, useState, ReactNode } from "react";
import { Productos } from "../types/index";

interface CartItem extends Productos {
    cantidad: number;
}

interface CartContextProps {
    cartCount: number;
    carrito: CartItem[];
    totalPrecio: number;
    agregarAlCarrito: (producto: Productos) => void;
    eliminarDelCarrito: (codProducto: number) => void;
    limpiarCarrito: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [carrito, setCarrito] = useState<CartItem[]>(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    });

    const cartCount = carrito.reduce((count, item) => count + item.cantidad, 0);
    const totalPrecio = carrito.reduce((total, item) => total + item.precio_venta * item.cantidad, 0);

    const agregarAlCarrito = (producto: Productos) => {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((p) => p.id_producto === producto.id_producto);

            if (productoExistente) {
                return prevCarrito.map((p) =>
                    p.id_producto === producto.id_producto ? { ...p, cantidad: p.cantidad + 1 } : p
                );
            } else {
                const nuevoProducto = { ...producto, cantidad: 1 };
                return [...prevCarrito, nuevoProducto];
            }
        });
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    const eliminarDelCarrito = (codProducto: number) => {
        setCarrito((prevCarrito) => {
            const nuevoCarrito = prevCarrito
                .map((p) => (p.id_producto === codProducto ? { ...p, cantidad: p.cantidad - 1 } : p))
                .filter((p) => p.cantidad > 0);

            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            return nuevoCarrito;
        });
    };

    const limpiarCarrito = () => {
        setCarrito([]);
        localStorage.removeItem("carrito");
    };

    return (
        <CartContext.Provider
            value={{
                cartCount,
                carrito,
                totalPrecio,
                agregarAlCarrito,
                eliminarDelCarrito,
                limpiarCarrito,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Productos } from "../types/index";
import { getUserName } from "../services/AuthService"; // Asume que esta función obtiene el usuario activo

interface CartItem extends Productos {
    cantidad: number;
}

interface CartContextProps {
    cartCount: number;
    carrito: CartItem[];
    agregarAlCarrito: (producto: Productos) => void;
    eliminarDelCarrito: (codProducto: number) => void;
    limpiarCarrito: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [carrito, setCarrito] = useState<CartItem[]>([]);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const nombreUsuario = getUserName();
        setUser(nombreUsuario);

        if (nombreUsuario) {
            const carritoGuardado = localStorage.getItem(`carrito_${nombreUsuario}`);
            setCarrito(carritoGuardado ? JSON.parse(carritoGuardado) : []);
        }
    }, [user]);

    // Guardar el carrito en localStorage cada vez que el carrito o el usuario cambien
    useEffect(() => {
        if (user) {
            localStorage.setItem(`carrito_${user}`, JSON.stringify(carrito));
        }
    }, [carrito, user]);

    const cartCount = carrito.reduce((total, item) => total + item.cantidad, 0);

    const guardarCarrito = (nuevoCarrito: CartItem[]) => {
        setCarrito(nuevoCarrito);
        if (user) {
            localStorage.setItem(`carrito_${user}`, JSON.stringify(nuevoCarrito));
        }
    };

    const agregarAlCarrito = (producto: Productos) => {
        const productoExistente = carrito.find((p) => p.id_producto === producto.id_producto);

        if (productoExistente) {
            const nuevoCarrito = carrito.map((p) =>
                p.id_producto === producto.id_producto ? { ...p, cantidad: p.cantidad + 1 } : p
            );
            guardarCarrito(nuevoCarrito);
        } else {
            const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
            guardarCarrito(nuevoCarrito);
        }
    };

    const eliminarDelCarrito = (codProducto: number) => {
        const nuevoCarrito = carrito
            .map((p) => (p.id_producto === codProducto ? { ...p, cantidad: p.cantidad - 1 } : p))
            .filter((p) => p.cantidad > 0);

        guardarCarrito(nuevoCarrito);
    };

    const limpiarCarrito = () => {
        guardarCarrito([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartCount,
                carrito,
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
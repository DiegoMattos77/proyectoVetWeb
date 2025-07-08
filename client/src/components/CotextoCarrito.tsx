import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Productos } from "../types/index";
import { getUserName, getUserId } from "../services/AuthService"; // Asume que esta función obtiene el usuario activo
import { verificarCarritoParaLimpiar } from "../services/CarritoService";

interface CartItem extends Productos {
    cantidad: number;
}

interface CartContextProps {
    cartCount: number;
    carrito: CartItem[];
    agregarAlCarrito: (producto: Productos) => void;
    eliminarDelCarrito: (codProducto: number) => void;
    limpiarCarrito: () => void;
    verificarCarritoVacio: () => boolean;
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
    }, []); // Eliminar user de las dependencias para evitar loops

    // Escuchar evento personalizado de limpieza del carrito y cambios en localStorage
    useEffect(() => {
        const handleCartCleared = () => {
            console.log('🔔 Evento cart-cleared recibido en contexto');
            if (user) {
                console.log('🧹 Forzando limpieza desde evento cart-cleared');
                setCarrito([]);
                localStorage.setItem(`carrito_${user}`, JSON.stringify([]));
                localStorage.removeItem(`carrito_${user}`); // También remover la clave
            }
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (user && e.key === `carrito_${user}`) {
                console.log('🔔 Cambio detectado en localStorage para carrito');
                const nuevoCarrito = e.newValue ? JSON.parse(e.newValue) : [];
                console.log(`📦 Actualizando carrito desde storage: ${user}`, nuevoCarrito);
                setCarrito(nuevoCarrito);
            }
        };

        // También escuchar el evento personalizado de storage que disparamos manualmente
        const handleCustomStorageEvent = () => {
            console.log('🔔 Evento storage personalizado recibido');
            if (user) {
                const carritoGuardado = localStorage.getItem(`carrito_${user}`);
                const carritoData = carritoGuardado ? JSON.parse(carritoGuardado) : [];
                console.log(`📦 Actualizando carrito desde evento storage: ${user}`, carritoData);
                setCarrito(carritoData);
            }
        };

        window.addEventListener('cart-cleared', handleCartCleared);
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('storage', handleCustomStorageEvent);

        return () => {
            window.removeEventListener('cart-cleared', handleCartCleared);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('storage', handleCustomStorageEvent);
        };
    }, [user]);

    // NUEVO: Verificar automáticamente si el carrito debe limpiarse por pago exitoso
    useEffect(() => {
        const verificarLimpiezaAutomatica = async () => {
            if (user) {
                const clienteId = getUserId(); // Obtener el ID del cliente
                if (clienteId) {
                    try {
                        console.log(`🔍 Verificando si debe limpiar carrito para cliente: ${clienteId}`);
                        const resultado = await verificarCarritoParaLimpiar(clienteId);
                        
                        if (resultado.limpiarCarrito) {
                            console.log(`🧹 Limpieza automática activada por pago exitoso: ${resultado.pagoId}`);
                            console.log(`📝 Mensaje: ${resultado.mensaje}`);
                            
                            // Limpiar el carrito
                            setCarrito([]);
                            localStorage.setItem(`carrito_${user}`, JSON.stringify([]));
                            localStorage.removeItem(`carrito_${user}`);
                            
                            // Disparar eventos
                            window.dispatchEvent(new Event('cart-cleared'));
                            window.dispatchEvent(new Event('storage'));
                            
                            console.log('✅ Carrito limpiado automáticamente por pago exitoso');
                        }
                    } catch (error) {
                        console.error('❌ Error al verificar limpieza automática:', error);
                    }
                }
            }
        };

        // Verificar inmediatamente al cargar
        verificarLimpiezaAutomatica();
        
        // También verificar cada 10 segundos durante los primeros 2 minutos
        // (en caso de que el usuario tarde en volver a la página)
        const intervalId = setInterval(verificarLimpiezaAutomatica, 10000);
        
        // Limpiar después de 2 minutos
        setTimeout(() => {
            clearInterval(intervalId);
            console.log('🔄 Verificación automática de limpieza detenida');
        }, 2 * 60 * 1000);
        
        return () => clearInterval(intervalId);
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
        console.log('🧹 Contexto: Limpiando carrito...');
        console.log('👤 Usuario actual:', user);
        
        const nuevoCarrito: CartItem[] = [];
        setCarrito(nuevoCarrito);
        
        if (user) {
            const carritoKey = `carrito_${user}`;
            console.log(`📦 Limpiando localStorage para: ${carritoKey}`);
            
            // Limpiar localStorage
            localStorage.setItem(carritoKey, JSON.stringify(nuevoCarrito));
            
            // Verificar que se limpió correctamente
            const verificacion = localStorage.getItem(carritoKey);
            console.log(`✅ Verificación de limpieza: ${carritoKey} =`, verificacion);
            
            // Forzar una actualización del DOM
            window.dispatchEvent(new Event('cart-cleared'));
            
            // También disparar un evento de storage para forzar actualización
            window.dispatchEvent(new Event('storage'));
        }
        
        console.log('✅ Contexto: Carrito limpiado');
    };

    const verificarCarritoVacio = () => {
        return carrito.length === 0;
    };

    return (
        <CartContext.Provider
            value={{
                cartCount,
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                limpiarCarrito,
                verificarCarritoVacio,
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
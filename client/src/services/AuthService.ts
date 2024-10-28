import axios from "axios";
import { safeParse } from "valibot";
import { LoginClienteSchema } from '../types/index';

type LoginData = {
    [key: string]: FormDataEntryValue;
};

const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`;


export async function login(data: LoginData): Promise<{ nombre: string, id_cliente: number }> {
    try {
        const result = safeParse(LoginClienteSchema, {
            mail: data.mail,
            password: data.password,
        });

        if (!result.success) {
            console.log(result.issues);
            throw new Error("Formato incorrecto en los datos");
        }

        const response = await axios.post(LOGIN_URL, {
            mail: result.output.mail,
            password: result.output.password,
        });

        const { authenticated, data: { nombre, id_cliente } } = response.data;

        if (!authenticated) {
            throw new Error("Correo o contraseña incorrectos");
        }

        console.log("Login exitoso:", response.data);
        localStorage.setItem("userName", nombre);
        localStorage.setItem("id_cliente", id_cliente)

        return { nombre, id_cliente };
    } catch (error: unknown) {
        console.error("Error en el login:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error de autenticación");
        }
        throw new Error("Error en el login");
    }
}

export function getUserName(): string | null {
    return localStorage.getItem("userName");  // Recupera el nombre desde localStorage
}

export function getUserId(): string | null {
    return localStorage.getItem("id_cliente");  // Recupera el nombre desde localStorage
}

export function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("id_cliente"); // Elimina el nombre del usuario al cerrar sesión
}

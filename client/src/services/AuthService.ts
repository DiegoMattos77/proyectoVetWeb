import axios from "axios";
import { safeParse } from "valibot";
import { LoginClienteSchema } from '../types/index';

type LoginData = {
    [key: string]: FormDataEntryValue;
};

const LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth`;
const SOLICITAR_PASSWORD_URL = `${import.meta.env.VITE_API_URL}/auth/solicitar-password`;
const RESTABLECER_PASSWORD_URL = `${import.meta.env.VITE_API_URL}/auth/restablecer-password`;

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

        // Espera que el backend devuelva { authenticated, data: { nombre, id_cliente }, token }
        const { authenticated, data: { nombre, id_cliente } = {}, token } = response.data;

        if (!authenticated) {
            throw new Error("Correo o contraseña incorrectos");
        }

        // Guarda el token en localStorage
        if (token) {
            localStorage.setItem("token", token);
        }

        localStorage.setItem("userName", nombre);
        localStorage.setItem("id_cliente", id_cliente);

        return { nombre, id_cliente };
    } catch (error: any) {
        console.error("Error en el login:", error);
        if (axios.isAxiosError(error) && error.response) {
            // Si el backend envía un mensaje personalizado, úsalo
            const backendMsg = error.response.data?.message || error.response.data?.error;
            if (backendMsg) {
                throw new Error(backendMsg);
            }
            // Si no, usa un mensaje genérico
            throw new Error("Correo o contraseña incorrectos");
        }
        // Otros errores
        throw new Error(error.message || "Error en el login");
    }
}

// Solicitar recuperación de contraseña (envía el email)
export async function solicitarRecuperacionPassword(mail: string) {
    return axios.post(SOLICITAR_PASSWORD_URL, { mail });
}

// Restablecer contraseña (envía token y nueva contraseña)
export async function restablecerPassword(token: string, newPassword: string) {
    return axios.post(RESTABLECER_PASSWORD_URL, { token, newPassword });
}

export function getUserName(): string | null {
    return localStorage.getItem("userName");  // Recupera el nombre desde localStorage
}

export function getUserId(): string | null {
    return localStorage.getItem("id_cliente");  // Recupera el id desde localStorage
}

export function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("id_cliente");
    localStorage.removeItem("token"); // Elimina el token al cerrar sesión
}
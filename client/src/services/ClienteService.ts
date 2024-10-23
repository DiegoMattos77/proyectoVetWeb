import axios from "axios";
import { safeParse } from "valibot";
import { Cliente, DrafClienteSchema } from '../types/index';

type ClienteData = {
    [key: string]: FormDataEntryValue;
};

const REGISTRO_URL = `${import.meta.env.VITE_API_URL}/registrarme`;

export async function registro(data: ClienteData): Promise<void> {
    try {
        const result = safeParse(DrafClienteSchema, {
            dni: data.dni,
            cuit_cuil: data.cuit_cuil,
            nombre: data.nombre,
            apellido: data.apellido,
            domicilio: data.domicilio,
            telefono: data.telefono,
            mail: data.mail,
            password: data.password
        });

        if (!result.success) {
            console.log(result.issues);
            throw new Error("Formato incorrecto en los datos");
        }

        const response = await axios.post(REGISTRO_URL, {
            dni: result.output.dni,
            cuit_cuil: result.output.cuit_cuil,
            nombre: result.output.nombre,
            apellido: result.output.apellido,
            domicilio: result.output.domicilio,
            telefono: result.output.telefono,
            mail: result.output.mail,
            password: result.output.password
        });

        const { authenticated } = response.data;

        if (!authenticated) {
            throw new Error("Correo o contraseña incorrectos");
        }

        console.log("Login exitoso:", response.data);
    } catch (error: unknown) {
        console.error("Error en el login:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error de autenticación");
        }
        throw new Error("Error en el login");
    }
}

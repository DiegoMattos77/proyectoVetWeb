import axios from "axios";
import { safeParse } from "valibot";
import { DrafClienteSchema } from '../types/index';

type ClienteData = {
    [key: string]: FormDataEntryValue;
};

const REGISTRO_URL = `${import.meta.env.VITE_API_URL}/clientes/registrarme`;

const estado = "activo";

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
            estado: estado,
            password: data.password
        });
        console.log(data)
        if (!result.success) {
            console.log(result.issues);
            console.log("Errores en la validación:", result.issues);
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
            estado: estado,
            password: result.output.password
        });

        console.log("Registro exitoso:", response.data);
    } catch (error: unknown) {
        console.error("Error en el registro:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error de registro");
        }
        throw new Error("Error en el registro");
    }
}

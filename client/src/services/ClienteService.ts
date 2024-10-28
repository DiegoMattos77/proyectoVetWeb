import axios from "axios";
import { safeParse } from "valibot";
import { DrafClienteSchema, ClienteSchema, ClienteCompleto } from '../types/index';

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

export async function actualizar(data: ClienteData, id_cliente: ClienteCompleto['id_cliente']): Promise<void> {

    try {
        const result = safeParse(ClienteSchema, {
            id_cliente,
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
        const URL = `${import.meta.env.VITE_API_URL}/clientes/${id_cliente}`;
        const response = await axios.put(URL, result.output);

        console.log("Actualización exitosa:", response.data);
    } catch (error: unknown) {
        console.error("Error en actualizar:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error de actualizacón");
        }
        throw new Error("Error en actualizar");
    }
}

export async function obtenerClienteById(id_cliente: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/clientes/${id_cliente}`;
        const { data } = await axios.get(url);
        const result = safeParse(ClienteSchema, data);

        if (result.success) {
            return result.output;
        } else {
            console.error('Errores de validación:', result.issues);
            throw new Error('El cliente no es válido');
        }
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        throw error;
    }
}

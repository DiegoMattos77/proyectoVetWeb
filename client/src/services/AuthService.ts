import axios from "axios"
import { safeParse } from "valibot"
import { LoginClienteSchema } from '../types/index'


type LoginData = {
    [k: string]: FormDataEntryValue
}


const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`


export async function login(data: LoginData) {

    try {
        const result = safeParse(LoginClienteSchema, {
            mail: data.mail,
            password: data.password
        })
        if (result.success) {
            const URL = LOGIN_URL
            await axios.post(URL, {
                mail: result.output.mail,
                password: result.output.password
            })
        } else {
            throw new Error("Correo o contraseña incorrectos")


        }
    } catch (error) {

        console.log(error)

    }

}


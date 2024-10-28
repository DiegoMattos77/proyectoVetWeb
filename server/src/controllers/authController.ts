import { Request, Response } from "express";
import ClienteLogin from "../models/Clientes.models";



export async function loginClientes(req: Request, res: Response) {
    try {
        const { mail, password } = req.body;
        const cliente = await ClienteLogin.findOne({ where: { mail, password } });

        if (!mail || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        if (!cliente) {
            return res.status(404).json({ message: "Verifique los datos ingresados" })
        }

        return res.json({
            data: {
                mail: cliente.mail,
                nombre: cliente.nombre,
                id_cliente: cliente.id_cliente
            },
            message: "Login exitoso",
            authenticated: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error al realizar el login",
            error: error.message
        })

    }

}
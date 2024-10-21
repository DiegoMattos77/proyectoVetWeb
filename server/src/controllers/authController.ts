import { Request, Response } from "express";
import LoginCliente from "../models/LoginClientes.models";



export async function loginClientes(req: Request, res: Response) {
    try {
        const { mail, password } = req.body;
        const cliente = await LoginCliente.findOne({ where: { mail, password } });

        if (!mail || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        if (!cliente) {
            return res.status(404).json({ message: "Verifique los datos ingresados" })
        }

        return res.json({
            data: {
                mail: cliente.mail,
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
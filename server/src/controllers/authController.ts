import { Request, Response } from "express";
import ClienteLogin from "../models/Clientes.models";

import jwt from "jsonwebtoken";
import { enviarCorreoRecuperacion } from "../utils/emailService";

import bcrypt from "bcryptjs"; // Si quieres encriptar la contraseña (opcional, pero recomendado)



const SECRET = process.env.JWT_SECRET || "clave_secreta";

export async function loginClientes(req: Request, res: Response) {
    console.log("Login endpoint hit", req.body);
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        // Busca solo por mail
        const cliente = await ClienteLogin.findOne({ where: { mail } });
        if (!cliente) {
            return res.status(404).json({ message: "Verifique los datos ingresados" });
        }

        // Compara la contraseña ingresada con el hash guardado
        const passwordValida = await bcrypt.compare(password, cliente.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        // GENERA EL TOKEN JWT AQUÍ
        const token = jwt.sign(
            { mail: cliente.mail, id_cliente: cliente.id_cliente, nombre: cliente.nombre },
            SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            data: {
                mail: cliente.mail,
                nombre: cliente.nombre,
                id_cliente: cliente.id_cliente
            },
            message: "Login exitoso",
            authenticated: true,
            token // <-- AGREGA EL TOKEN AQUÍ
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al realizar el login",
            error: error.message
        });
    }
}

// endpoint de recuperación en el controlador

//const SECRET = process.env.JWT_SECRET || "clave_secreta";

export async function solicitarRecuperacionPassword(req: Request, res: Response) {
    const { mail } = req.body;
    if (!mail) {
        return res.status(400).json({ message: "El correo es requerido" });
    }

    const cliente = await ClienteLogin.findOne({ where: { mail } });
    if (!cliente) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar token JWT válido por 1 hora
    const token = jwt.sign({ mail }, SECRET, { expiresIn: "1h" });
    const link = `http://localhost:5173/restablecer?token=${token}`; // Cambia la URL según tu frontend

    // Enviar correo
    await enviarCorreoRecuperacion(mail, link);

    return res.json({ message: "Se ha enviado un enlace de recuperación a su correo." });
}

export async function restablecerPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token y nueva contraseña son requeridos" });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as { mail: string };
        const cliente = await ClienteLogin.findOne({ where: { mail: decoded.mail } });
        if (!cliente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        cliente.password = hashedPassword;

        await cliente.save();

        return res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        return res.status(400).json({ message: "Token inválido o expirado" });
    }
}
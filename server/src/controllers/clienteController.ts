import { Request, Response } from "express";
import cliente from "../models/Clientes.models";
import bcrypt from "bcryptjs";

//Creo un nuevo cliente
export const createClient = async (req: Request, res: Response) => {
    try {
        // Encripta la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Crea el cliente usando la contraseña encriptada
        const client = await cliente.create({
            ...req.body,
            password: hashedPassword
        });

        res.status(201).json(client);
    } catch (error) {
        console.error('Error al crear un cliente', error);
        res.status(500).json({ error: error.message });
    }
};

//Obtengo todos los clientes
export const getClients = async (req: Request, res: Response) => {
    try {
        const client = await cliente.findAll();
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Obtengo un cliente por su id
export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await cliente.findByPk(req.params.id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: "No se encontraron clientes" });
        }
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Actualizo un cliente
export const updateClient = async (req: Request, res: Response) => {
    try {
        const client = await cliente.findByPk(req.params.id);
        if (client) {
            await client.update(req.body);
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: "No se encontraron clientes para modificar" });
        }
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Elimino un cliente
// export const deleteClient = async (req: Request, res: Response) => {
//     try {
//         const deleted = await cliente.destroy({
//             where: { id_cliente: req.params.id }
//         });
//         if (deleted) {
//             res.status(204).send();
//         } else {
//             res.status(404).json({ error: "No se encontraron clientes para eliminar" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.messaje });
//     }
// };


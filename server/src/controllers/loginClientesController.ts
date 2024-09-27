import { Request, Response } from "express";
import LoginCliente from "../models/LoginClientes.models";

//Creo un nuevo cliente
export const createClient = async (req: Request, res: Response) => {
    try {
        const client = await LoginCliente.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        console.error('Error al crear un cliente', error);
        res.status(500).json({ error: error.messaje });
    }
};

//Obtengo todos los clientes
export const getClients = async (req: Request, res: Response) => {
    try {
        const client = await LoginCliente.findAll();
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.messaje });
    }
};

//Obtengo un cliente por su id
export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await LoginCliente.findByPk(req.params.id);
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
        const client = await LoginCliente.findByPk(req.params.id);
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
//         const deleted = await LoginCliente.destroy({
//             where: { id_clientes: req.params.id }
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


import Express from "express";
import routerCliente from "./router/routerCliente";
import routerLoginClientes from "./router/routerLoginClientes";
import routerProductos from "./router/routerProductos";
import routerPedidos from "./router/routerPedidos";
import db from './config/db';

const server = Express();

server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));

server.use('/api/clientes', routerCliente);
server.use('/api/login', routerLoginClientes);
server.use('/api/productos', routerProductos);
server.use('/api/pedidos', routerPedidos);


async function connectDB() {
    try {
        await db.authenticate();
        await db.sync()
        console.log('DB is connected')
    } catch (error) {
        console.log(error)
        console.log('DB is not connected')
    }
}

connectDB()

export default server;

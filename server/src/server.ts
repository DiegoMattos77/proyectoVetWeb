import Express from "express";
import routerCliente from "./router/routerCliente";
import authRouter from "./router/authRouter";
import routerProductos from "./router/routerProductos";
import routerPedidos from "./router/routerPedidos";
import routerDetallePedidos from "./router/routerDetallePedidos";
import db from './config/db';
import cors from 'cors';

const server = Express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: 'GET,HEAD,PUT,POST',
    credentials: true,
    optionsSuccessStatus: 204,
};

server.use(cors(corsOptions));
server.options('*', cors(corsOptions));

server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));

server.use('/api/clientes', routerCliente);
server.use('/api/login', authRouter);
server.use('/api/productos', routerProductos);
server.use('/api/pedidos', routerPedidos);
server.use('/api/detalle', routerDetallePedidos);
server.use('/api/roducto/:id', routerProductos);





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

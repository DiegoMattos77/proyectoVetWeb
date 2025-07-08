import Express from "express";
import routerCliente from "./router/routerCliente";
import authRouter from "./router/authRouter";
import routerProductos from "./router/routerProductos";
import routerPedidos from "./router/routerPedidos";
import routerDetallePedidos from "./router/routerDetallePedidos";
import carritoRouter from './router/carritoRouter';
import { db } from './config/db';
import cors from 'cors';
import webHookRouter from './router/webhook.routes';
import paymentRouter from './router/payment.router';
import preferencesRouter from './router/preferences.routes';
import handlePaymentRedirect from './router/redirectrouter';
import routerRemito from './router/routerRemito';



const server = Express();

const corsOptions = {
    origin: "http://localhost:5173",

    methods: 'GET,HEAD,PUT,POST',
    credentials: true,
    optionsSuccessStatus: 204,
};

server.use(cors(corsOptions));
server.options('*', cors(corsOptions));

// Middleware para agregar headers de ngrok a todas las respuestas
server.use((req, res, next) => {
    res.set('ngrok-skip-browser-warning', 'true');
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
});

server.use(Express.json({ limit: '10mb' })); // o el tamaño que necesites
server.use(Express.urlencoded({ extended: true, limit: '10mb' }));
server.use('/api/webhooks', webHookRouter);
server.use('/api/clientes', routerCliente);
server.use('/api/auth', authRouter);
server.use('/api/productos', routerProductos);
server.use('/api/pedidos', routerPedidos);
server.use('/api/detalle', routerDetallePedidos);
server.use('/api/payments', paymentRouter);
server.use('/api', handlePaymentRedirect);
server.use('/api', preferencesRouter);
server.use('/api', routerRemito);
server.use('/api/carrito', carritoRouter);






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

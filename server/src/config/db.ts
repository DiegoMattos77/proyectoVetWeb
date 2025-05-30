import { Sequelize } from 'sequelize-typescript';
import Productos from '../models/Productos.models';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*.ts']
});



if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error('MP_ACCESS_TOKEN no definido en el archivo .env');
}

export const config = {
    accessToken: process.env.MP_ACCESS_TOKEN,
};


export { db, Productos }; 
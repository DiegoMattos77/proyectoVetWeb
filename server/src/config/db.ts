import { Sequelize } from 'sequelize-typescript';
import Productos from '../models/Productos.models';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*.ts']
});

export { db, Productos }; 
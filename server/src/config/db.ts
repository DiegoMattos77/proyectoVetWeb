import { Sequelize } from 'sequelize-typescript';
import Productos from '../models/Productos.models';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*.ts'],
    timezone: '-03:00', // Zona horaria de Argentina (UTC-3)
    dialectOptions: {
        dateStrings: true,
        typeCast: function (field: any, next: any) {
            // for reading from database
            if (field.type === 'DATETIME') {
                return field.string();
            }
            return next();
        },
    },
    logging: console.log // Para ver las consultas SQL
});



if (!process.env.MP_ACCESS_TOKEN) {
    throw new Error('MP_ACCESS_TOKEN no definido en el archivo .env');
}

export const config = {
    accessToken: process.env.MP_ACCESS_TOKEN,
};


export { db, Productos }; 
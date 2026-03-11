import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

//Database instance
const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

//Connection to database
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to database.')
    } catch (error) {
        console.error('DB Connection Error: ', error)
    }
};

export { sequelize, connectDB };

import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

// Set up Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
    }
);

// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected successfully');
    } catch (error) {
        console.error('Unable to connect to the database', error);
    }
}

testConnection();



export default sequelize;
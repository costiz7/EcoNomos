import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './database/db.js';
import './database/models/User.js'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const startServer = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });
    app.listen(PORT, console.log(`Serverul ruleaza pe: http://localhost:${PORT}`));
}

startServer()


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './database/db.js';
import { seedCategories } from './database/seed.js';
import './database/associations.js';
import authRouter from './routes/authRoutes.js';
import apiRouter from './routes/apiRoutes.js';


dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api', apiRouter);

//This async function connects to the database, synchronizes it, seeds it (1st start only), then listens for the port
const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    await seedCategories();
    app.listen(PORT, console.log(`The server is running on: http://localhost:${PORT}`));
}

startServer()


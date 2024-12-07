import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { log } from 'console';
import { connectDB } from '../config/db.js';
import userRoutes from '../routes/user.routes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1/users', userRoutes);

server.listen(process.env.PORT, () => {
    log('Server has started.');
})
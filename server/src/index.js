import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { log } from 'console';
import { connectDB } from '../config/db.js';
import userRoutes from '../routes/user.routes.js';
import productRoutes from '../routes/product.routes.js';
import shopRoutes from '../routes/shop.routes.js';
import cartRoutes from '../routes/cart.routes.js';
import { initializeSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

initializeSocket(server);

app.use(cors()); //remove cors options for PORT
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/shops', shopRoutes);
app.use('/api/v1/cart', cartRoutes);

server.listen(process.env.PORT, () => {
    log('Server has started.');
})
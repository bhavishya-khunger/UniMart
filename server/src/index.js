import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { log } from 'console';
import { connectDB } from '../config/db.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({extended: true}));

server.listen(process.env.PORT, () => {
    log('Server has started.');
})
import mongoose from 'mongoose';
import { log } from 'console';

export const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('Database is connected.');


    } catch (error) {
        log(error);
    }
}
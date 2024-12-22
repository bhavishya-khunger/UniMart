import { Server } from 'socket.io';
import User from '../models/user.model.js';

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId } = data;
            await User.findByIdAndUpdate(userId, { socketId: socket.id });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);
        if (io) {
            io.to(socketId).emit(messageObject.event, messageObject.data);
        } else {
            console.log('Socket.io not initialized.');
        }
    }

export { initializeSocket, sendMessageToSocketId };
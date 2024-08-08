const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Adjust according to your client domain
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle join-room event
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Client with ID ${socket.id} joined room: ${roomId}`);
        
        // Notify other users in the room about the new user
        socket.broadcast.to(roomId).emit('user-connected', socket.id);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client with ID ${socket.id} disconnected`);
            // Notify other users in the room about the disconnection
            socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
        });
    });

    // Handle offer event
    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer);
    });

    // Handle answer event
    socket.on('answer', (answer, roomId) => {
        socket.to(roomId).emit('answer', answer);
    });

    // Handle ICE candidate event
    socket.on('ice-candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });
});

app.get('/', (req, res) => {
    res.send('WebRTC server is running');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

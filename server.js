const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Client with ID ${socket.id} joined room: ${roomId}`);
        socket.broadcast.to(roomId).emit('user-connected', socket.id);

        socket.on('disconnect', () => {
            console.log(`Client with ID ${socket.id} disconnected`);
            socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
        });
    });

    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer, roomId) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('WebRTC server is running');
});

http.listen(3000, () => {
    console.log('Server is running on port 3000');
});

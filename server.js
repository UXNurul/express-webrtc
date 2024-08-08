const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('New client connected');
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

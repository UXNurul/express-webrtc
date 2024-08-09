// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import CORS middleware

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins. You may want to restrict this in production.
    methods: ['GET', 'POST']
  }
});

app.use(cors()); // Use CORS middleware

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
}
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

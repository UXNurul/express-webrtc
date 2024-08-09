require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://127.0.0.1:5173" }, // Ensure correct CORS origin
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("message", (message) => {
    socket.broadcast.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

function error(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
}

app.use(error);

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

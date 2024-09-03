import { createServer } from "http";
import { join } from "path";
import express from "express";
import connectToWhatsApp from "./client";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

connectToWhatsApp(io);
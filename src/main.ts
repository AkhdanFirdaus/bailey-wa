import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import connectToWhatsApp from "./client";
import ioevent from "./ioevent";
import endpoint from "./endpoint";

const app = express();
const server = createServer(app);
const io = new Server(server);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

endpoint(app);
ioevent(io);
connectToWhatsApp(io);
import type { Server } from "socket.io";

export default (io: Server) => {
  io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  
};
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.user = user;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log('a user connected:', socket.user.userId);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('chatMessage', (msg, roomId) => {
      io.to(roomId).emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};

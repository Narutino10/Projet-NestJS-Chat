import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: { token },
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion WebSocket :', err.message);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Déconnecté du serveur WebSocket');
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

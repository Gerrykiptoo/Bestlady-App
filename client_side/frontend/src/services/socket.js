import { io } from 'socket.io-client';
import { useToast } from 'vue-toast-notification';

let socket = null;

// Dev: connect directly to localhost:5000 (socket.io bypasses Vite proxy)
// Prod (Vercel): VITE_BACKEND_URL = https://your-ngrok-url.ngrok-free.app
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const initSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionAttempts: 10,
  });

  const toast = useToast();

  socket.on('connect', () => {
    console.log('🔌 Socket connected');
    if (userId) socket.emit('join', userId);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  socket.on('notification', (data) => {
    toast.info(data.message, { duration: 5000, position: 'top-right' });
  });

  socket.on('orderUpdate', (data) => {
    toast.success(`Order #${data.orderNumber} is now ${data.status}!`, { duration: 6000 });
  });

  socket.on('walletUpdate', (data) => {
    if (data.balance !== undefined) {
      toast.success(`Wallet updated: KES ${parseFloat(data.balance).toLocaleString()}`, { duration: 4000 });
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, disconnectSocket };

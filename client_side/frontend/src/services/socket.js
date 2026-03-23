const { io } = require('socket.io-client');
import { useToast } from 'vue-toast-notification';

let socket = null;

export const initSocket = (userId) => {
  if (socket) return;

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    withCredentials: true
  });

  const toast = useToast();

  socket.on('connect', () => {
    console.log('🔌 Connected to Socket.io');
    socket.emit('join', userId);
  });

  socket.on('notification', (data) => {
    toast.info(data.message, {
      duration: 5000,
      position: 'top-right'
    });
  });

  socket.on('orderUpdate', (data) => {
    toast.success(`Order #${data.orderNumber} is now ${data.status}!`, {
      duration: 10000
    });
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, disconnectSocket };

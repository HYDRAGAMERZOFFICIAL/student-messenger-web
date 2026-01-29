import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, STORAGE_KEYS } from '../utils/constants';
import { SOCKET_EVENTS } from '../utils/socketEvents';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string) => {
    socketRef.current?.off(event);
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  };
};

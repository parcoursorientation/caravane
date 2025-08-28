import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface RealTimeStats {
  totalLycees: number;
  totalExposants: number;
  totalEvenements: number;
  totalMessages: number;
  totalInscriptions: number;
  totalPartenaires: number;
  totalMedias: number;
  totalGaleries: number;
  recentMessages: number;
  recentInscriptions: number;
  recentEvenements: number;
  recentExposants: number;
  recentLycees: number;
  timestamp: string;
}

export const useRealTimeStats = (autoRefresh = true) => {
  const [stats, setStats] = useState<RealTimeStats | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Determine the socket server URL based on the current environment
    let socketUrl;
    
    if (typeof window !== 'undefined') {
      // Client-side: use the current origin with explicit port for development
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        // In development, connect to the same host but with explicit port
        socketUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
      } else {
        // In production, use the current origin
        socketUrl = window.location.origin;
      }
    } else {
      // Server-side: use localhost (this shouldn't happen in client-side hook)
      socketUrl = 'http://localhost:3000';
    }
    
    console.log('Connecting to socket at:', socketUrl);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Window location:', typeof window !== 'undefined' ? window.location.href : 'server-side');
    
    // Initialize socket connection
    const socketInstance = io(socketUrl, {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5, // Increased attempts
      reconnectionDelay: 1000,
      timeout: 10000, // Increased timeout
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server at:', socketUrl);
      setIsConnected(true);
      setError(null);
      
      // Join statistics room
      socketInstance.emit('join', 'statistics');
      
      // Request initial stats update
      if (autoRefresh) {
        socketInstance.emit('request-stats-update');
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      setIsConnected(false);
      
      // If the disconnection was due to an error, set an appropriate error message
      if (reason === 'io server disconnect') {
        setError('Server disconnected');
      } else if (reason === 'transport close') {
        setError('Connection closed');
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      console.error('Connection details:', {
        url: socketUrl,
        transports: socketInstance.io.opts.transports,
        path: socketInstance.io.opts.path
      });
      setError(`Failed to connect to real-time server: ${err.message}`);
      setIsConnected(false);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setError('Failed to reconnect to real-time server after multiple attempts');
      setIsConnected(false);
    });

    // Listen for stats updates
    socketInstance.on('stats-update', (newStats: RealTimeStats) => {
      setStats(newStats);
    });

    // Listen for stats errors
    socketInstance.on('stats-error', (err: { message: string }) => {
      setError(err.message);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [autoRefresh]);

  // Function to manually request stats update
  const requestStatsUpdate = () => {
    if (socket && isConnected) {
      socket.emit('request-stats-update');
    } else {
      console.warn('Socket not connected, cannot request stats update');
      setError('Real-time connection not available');
    }
  };

  // Function to check if real-time features are available
  const isRealTimeAvailable = isConnected && !error;

  return {
    stats,
    isConnected,
    error,
    requestStatsUpdate,
    isRealTimeAvailable
  };
};
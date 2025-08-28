import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join statistics room for real-time updates
    socket.join('statistics');
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle request for statistics update
    socket.on('request-stats-update', async () => {
      try {
        // Import db dynamically to avoid circular dependency
        const { db } = await import('@/lib/db');
        
        // Get current statistics
        const stats = await getRealTimeStats(db);
        
        // Send to the requesting client
        socket.emit('stats-update', stats);
      } catch (error) {
        console.error('Error fetching real-time stats:', error);
        socket.emit('stats-error', { message: 'Failed to fetch statistics' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socket.leave('statistics');
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

// Function to get real-time statistics
export const getRealTimeStats = async (db: any) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalLycees,
    totalExposants,
    totalEvenements,
    totalMessages,
    totalInscriptions,
    totalPartenaires,
    totalMedias,
    totalGaleries,
    recentMessages,
    recentInscriptions,
    recentEvenements,
    recentExposants,
    recentLycees
  ] = await Promise.all([
    db.lycee.count(),
    db.exposant.count(),
    db.evenement.count(),
    db.contactMessage.count(),
    db.inscription.count(),
    db.partenaire.count(),
    db.media.count(),
    db.galerie.count(),
    db.contactMessage.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    db.inscription.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    db.evenement.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    db.exposant.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    db.lycee.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })
  ]);

  return {
    totalLycees,
    totalExposants,
    totalEvenements,
    totalMessages,
    totalInscriptions,
    totalPartenaires,
    totalMedias,
    totalGaleries,
    recentMessages,
    recentInscriptions,
    recentEvenements,
    recentExposants,
    recentLycees,
    timestamp: new Date().toISOString()
  };
};

// Function to broadcast statistics update to all connected clients
export const broadcastStatsUpdate = async (io: Server, db: any) => {
  try {
    const stats = await getRealTimeStats(db);
    io.to('statistics').emit('stats-update', stats);
  } catch (error) {
    console.error('Error broadcasting stats update:', error);
  }
};
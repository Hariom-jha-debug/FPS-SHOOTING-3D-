const { Server } = require('socket.io');

class GameServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });
    
    this.rooms = new Map();
    this.initializeSocket();
  }

  initializeSocket() {
    this.io.on('connection', (socket) => {
      console.log('Player connected:', socket.id);
      
      // Create or join room
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, {
            players: new Set(),
            gameState: 'waiting'
          });
        }
        this.rooms.get(roomId).players.add(socket.id);
        
        socket.to(roomId).emit('playerJoined', { playerId: socket.id });
      });

      // Player movement
      socket.on('playerMove', (data) => {
        socket.to(data.roomId).emit('playerMoved', {
          playerId: socket.id,
          position: data.position,
          rotation: data.rotation
        });
      });

      // Player shooting
      socket.on('playerShoot', (data) => {
        socket.to(data.roomId).emit('playerShot', {
          playerId: socket.id,
          hit: data.hit,
          targetId: data.targetId
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        this.rooms.forEach((room, roomId) => {
          if (room.players.has(socket.id)) {
            room.players.delete(socket.id);
            socket.to(roomId).emit('playerLeft', { playerId: socket.id });
          }
        });
      });
    });
  }
}

module.exports = GameServer;

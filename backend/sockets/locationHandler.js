import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import LocationHistory from '../models/LocationHistory.js';

export const setupLocationHandlers = (io) => {
  // Middleware for socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.userId;
      next();
    });
  });

  io.on('connection', async (socket) => {
    console.log(`User connected via socket: ${socket.userId}`);

    // Join a global room for location updates
    socket.join('global-location-room');

    // Handle receiving location updates from client
    socket.on('updateLocation', async (data) => {
      const { lat, lng } = data;

      try {
        const user = await User.findById(socket.userId);
        
        // Only broadcast if tracking is explicitly enabled
        if (user && user.trackingEnabled) {
          const timestamp = new Date();
          
          // Update last known location
          user.lastLocation = { lat, lng, timestamp };
          await user.save();

          // Save to history asynchronously
          LocationHistory.create({
            userId: user._id,
            location: { lat, lng },
            timestamp
          });

          // Broadcast to other users in the room
          socket.to('global-location-room').emit('locationUpdate', {
            userId: user._id,
            username: user.username,
            lat,
            lng,
            timestamp
          });
        }
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });

    socket.on('stopTracking', async () => {
      try {
        const user = await User.findById(socket.userId);
        if (user) {
          user.trackingEnabled = false;
          await user.save();
          // Notify others this user stopped tracking
          io.to('global-location-room').emit('userStoppedTracking', { userId: user._id });
        }
      } catch (error) {
        console.error('Error stopping tracking:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

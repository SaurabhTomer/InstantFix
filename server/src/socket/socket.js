import { Server } from "socket.io";

// (Singleton pattern – only ONE socket server in whole app)
let io;

/**
 * Initialize socket.io with HTTP server
 * This function runs ONCE when server starts
 */
export const initSocket = (server) => {
  // Attach socket.io to the HTTP server
  io = new Server(server, {
    cors: {
      origin: "*", // allow all origins 
    },
  });

  // Listen for new socket connections
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * Custom event: join-room
     * Client sends userId
     * We use userId as room name
     */
    socket.on("join-room", (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
      
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  // Return io instance 
  return io;
};

/**
 * Get already initialized socket.io instance
 * Used inside controllers to emit events
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

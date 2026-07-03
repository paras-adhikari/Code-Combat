const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: `${process.env.FRONTEND_URL}`, // React app URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    
    
    
    // Handle joining a room (team-specific)
    socket.on("joinRoom", (teamId) => {
      socket.join(teamId);
      console.log(`User ${socket.id} joined room: ${teamId}`);
    });
    
    
    // Listen for messages and broadcast to the specific room
    socket.on("message", ({ teamId, content, sender }) => {
    console.log('Received message from teamId:', teamId);
    console.log('Sender:', sender);
    console.log('Message content:', content);
      const message = { sender, content, timestamp: new Date() };
      socket.broadcast.to(teamId).emit("message", message); 
      // Broadcast to the specific room
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;

/**
 * Test script to verify Socket.io server setup
 */

const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");

// Create test server
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Test Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Test client connected: ${socket.id}`);

  // Test event room joining
  socket.on("join-event-room", (eventId) => {
    socket.join(`event-${eventId}`);
    console.log(
      `📅 Test client ${socket.id} joined event room: event-${eventId}`
    );

    // Send confirmation
    socket.emit("room-joined", {
      eventId: eventId,
      room: `event-${eventId}`,
      message: "Successfully joined event room",
    });
  });

  // Test broadcasting
  socket.on("test-broadcast", (data) => {
    console.log(`📢 Test broadcast received:`, data);
    io.emit("test-response", {
      message: "Broadcast received successfully",
      originalData: data,
      timestamp: new Date().toISOString(),
    });
  });

  // Test room-specific broadcasting
  socket.on("test-room-broadcast", (data) => {
    const { eventId, message } = data;
    console.log(`📢 Test room broadcast for event ${eventId}:`, message);
    io.to(`event-${eventId}`).emit("test-room-response", {
      eventId: eventId,
      message: message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Test client disconnected: ${socket.id}`);
  });
});

const port = 5017; // Different port for testing

server.listen(port, () => {
  console.log(`🧪 Socket.io Test Server running on port ${port}`);
  console.log(`🔌 Ready for Socket.io connections`);
  console.log(`📡 Test URL: http://localhost:${port}`);
  console.log(`\n📋 Available test events:`);
  console.log(`   - join-event-room: Join a specific event room`);
  console.log(`   - test-broadcast: Test global broadcasting`);
  console.log(`   - test-room-broadcast: Test room-specific broadcasting`);
  console.log(`\n🚀 Server is ready for testing!`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down test server...");
  server.close(() => {
    console.log("✅ Test server closed");
    process.exit(0);
  });
});

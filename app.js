const express = require("express");
const cookieParser = require("cookie-parser");
const Routes = require("./src/Middlewares/routes-config");
const { errorHandler, notFoundHandler } = require("./src/Middlewares/errors");
const cors = require("cors");
const clear = require("clear");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const https = require("https");

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

const corsOptions = require("./src/Middlewares/CORS-conf/cors-options");
const credentials = require("./src/Middlewares/CORS-conf/credentials");
const port = process.env.PORT || 5016;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors setup
app.use(credentials);
app.use(cors(corsOptions));

Routes(app);

//error handlers middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join room for event updates
  socket.on("join-event-room", (eventId) => {
    socket.join(`event-${eventId}`);
    console.log(`📅 Client ${socket.id} joined event room: event-${eventId}`);
  });

  // Leave room for event updates
  socket.on("leave-event-room", (eventId) => {
    socket.leave(`event-${eventId}`);
    console.log(`📅 Client ${socket.id} left event room: event-${eventId}`);
  });

  // Leave room when disconnecting
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set("io", io);

// HTTPS Configuration for Production (commented out for development)
/*
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/your-domain.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/your-domain.com/fullchain.pem"),
};

// Create HTTPS server for production
const httpsServer = https.createServer(options, app);
const httpsIO = new Server(httpsServer, {
  cors: {
    origin: process.env.CLIENT_URL || "https://your-domain.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// HTTPS Socket.io connection handling
httpsIO.on("connection", (socket) => {
  console.log(`🔌 HTTPS Client connected: ${socket.id}`);

  // Join room for event updates
  socket.on("join-event-room", (eventId) => {
    socket.join(`event-${eventId}`);
    console.log(
      `📅 HTTPS Client ${socket.id} joined event room: event-${eventId}`
    );
  });

  // Leave room when disconnecting
  socket.on("disconnect", () => {
    console.log(`🔌 HTTPS Client disconnected: ${socket.id}`);
  });
});

// Make HTTPS io available to routes
app.set("httpsIO", httpsIO);

// Production HTTPS Server
httpsServer.listen(443, () => {
  clear(); // Clear the terminal when the server starts
  console.log(`🚀 HTTPS Server running on port 443`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "production"}`);
  console.log(`📡 HTTPS API Base URL: https://your-domain.com`);
  console.log(`🔌 HTTPS Socket.io server ready for connections`);
});
*/

// Development HTTP Server
server.listen(port, () => {
  clear(); // Clear the terminal when the server starts
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 API Base URL: http://localhost:${port}`);
  console.log(`🔌 Socket.io server ready for connections`);
});

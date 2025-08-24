const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: false,
  },
  maxHttpBufferSize: 10e6, // 10MB for file uploads
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Enhanced data structures
const users = {};
const rooms = {};
const messageHistory = {}; // Store messages per room during session
const userLastSeen = {}; // Track when users were last active

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, documents, and some media files
    const allowedTypes =
      /jpeg|jpg|png|gif|webp|pdf|txt|doc|docx|mp3|mp4|mov|avi/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images, documents, and media files are allowed!"));
    }
  },
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadsDir));

// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    };

    res.json(fileInfo);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rate limiting per user
const messageRateLimit = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_MESSAGES_PER_WINDOW = 5;

function checkRateLimit(socketId) {
  const now = Date.now();
  const userRateData = messageRateLimit.get(socketId) || {
    count: 0,
    windowStart: now,
  };

  if (now - userRateData.windowStart > RATE_LIMIT_WINDOW) {
    userRateData.count = 1;
    userRateData.windowStart = now;
  } else {
    userRateData.count++;
  }

  messageRateLimit.set(socketId, userRateData);
  return userRateData.count <= MAX_MESSAGES_PER_WINDOW;
}

function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveMessage(room, messageData) {
  if (!messageHistory[room]) {
    messageHistory[room] = [];
  }

  // Keep only last 100 messages per room to prevent memory issues
  if (messageHistory[room].length >= 100) {
    messageHistory[room].shift();
  }

  messageHistory[room].push(messageData);
}

function updateUserLastSeen(socketId) {
  if (users[socketId]) {
    userLastSeen[socketId] = Date.now();
  }
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (data) => {
    try {
      const { username, secretKey } = data;

      if (!username || !secretKey) {
        socket.emit("error", {
          message: "Username and secret key are required",
        });
        return;
      }

      if (username.length > 20) {
        socket.emit("error", {
          message: "Username too long (max 20 characters)",
        });
        return;
      }

      // Check if username already exists in the room (allow reconnections)
      if (rooms[secretKey]) {
        const existingUserIndex = rooms[secretKey].findIndex(
          (user) => user.username === username,
        );
        if (existingUserIndex !== -1) {
          // Remove old connection for this username
          rooms[secretKey].splice(existingUserIndex, 1);
          console.log(`Reconnecting user: ${username}`);
        }
      }

      socket.join(secretKey);
      socket.username = username;
      socket.room = secretKey;

      // Store user info
      users[socket.id] = { username, room: secretKey, joinedAt: Date.now() };
      updateUserLastSeen(socket.id);

      // Add user to room
      if (!rooms[secretKey]) {
        rooms[secretKey] = [];
      }
      rooms[secretKey].push({
        username,
        socketId: socket.id,
        status: "online",
      });

      // Send message history to newly joined user
      if (messageHistory[secretKey] && messageHistory[secretKey].length > 0) {
        socket.emit("message_history", messageHistory[secretKey]);
      }

      // Announce user joined
      const roomUsers = rooms[secretKey].map((user) => ({
        username: user.username,
        status: user.status,
      }));

      socket.broadcast.to(secretKey).emit("user_joined", {
        username: username,
        users: roomUsers,
        timestamp: new Date().toISOString(),
      });

      socket.emit("join_success", {
        users: roomUsers,
        room: secretKey,
      });

      console.log(`${username} joined room: ${secretKey}`);
    } catch (error) {
      console.error("Join error:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("message", (data) => {
    try {
      if (!socket.room || !socket.username) {
        socket.emit("error", { message: "You must join a room first" });
        return;
      }

      if (!checkRateLimit(socket.id)) {
        socket.emit("error", {
          message: "You're sending messages too quickly",
        });
        return;
      }

      const { content, type = "text" } = data;

      if (
        !content ||
        (typeof content === "string" && content.trim().length === 0)
      ) {
        return;
      }

      updateUserLastSeen(socket.id);

      const messageData = {
        id: generateMessageId(),
        username: socket.username,
        content: content,
        type: type,
        timestamp: new Date().toISOString(),
        reactions: {},
        status: "sent",
      };

      // Save message to history
      saveMessage(socket.room, messageData);

      // Broadcast to room (excluding sender)
      socket.to(socket.room).emit("message", messageData);

      // Send confirmation back to sender with message ID
      socket.emit("message_sent", {
        id: messageData.id,
        status: "delivered",
      });
    } catch (error) {
      console.error("Message error:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("reaction", (data) => {
    try {
      const { messageId, emoji } = data;

      if (!socket.room || !socket.username) {
        return;
      }

      if (!messageId || !emoji) {
        return;
      }

      updateUserLastSeen(socket.id);

      // Find message in history
      if (messageHistory[socket.room]) {
        const message = messageHistory[socket.room].find(
          (msg) => msg.id === messageId,
        );
        if (message) {
          if (!message.reactions) {
            message.reactions = {};
          }

          if (!message.reactions[emoji]) {
            message.reactions[emoji] = [];
          }

          // Toggle reaction
          const userIndex = message.reactions[emoji].indexOf(socket.username);
          if (userIndex === -1) {
            message.reactions[emoji].push(socket.username);
          } else {
            message.reactions[emoji].splice(userIndex, 1);
            // Remove empty reaction arrays
            if (message.reactions[emoji].length === 0) {
              delete message.reactions[emoji];
            }
          }

          // Broadcast reaction update
          io.to(socket.room).emit("reaction_update", {
            messageId: messageId,
            reactions: message.reactions,
            username: socket.username,
            emoji: emoji,
          });
        }
      }
    } catch (error) {
      console.error("Reaction error:", error);
    }
  });

  socket.on("typing", () => {
    if (socket.room && socket.username) {
      updateUserLastSeen(socket.id);
      socket.to(socket.room).emit("user_typing", {
        username: socket.username,
        timestamp: Date.now(),
      });
    }
  });

  socket.on("stop_typing", () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit("stop_typing", {
        username: socket.username,
      });
    }
  });

  socket.on("user_activity", () => {
    updateUserLastSeen(socket.id);
  });

  socket.on("privacy_violation", (data) => {
    try {
      if (!socket.room || !socket.username) {
        return;
      }

      const { type, message } = data;

      if (!type || !message) {
        return;
      }

      updateUserLastSeen(socket.id);

      // Broadcast privacy violation to other users in the room
      socket.to(socket.room).emit("privacy_violation", {
        type: type,
        message: message,
        timestamp: new Date().toISOString(),
        violator: socket.username,
      });

      console.log(`Privacy violation in room ${socket.room}: ${message}`);
    } catch (error) {
      console.error("Privacy violation error:", error);
    }
  });

  socket.on("disconnect", (reason) => {
    try {
      console.log(`User disconnected: ${socket.id}, reason: ${reason}`);

      if (socket.username && socket.room) {
        // Remove user from room
        if (rooms[socket.room]) {
          rooms[socket.room] = rooms[socket.room].filter(
            (user) => user.socketId !== socket.id,
          );

          const remainingUsers = rooms[socket.room].map((user) => ({
            username: user.username,
            status: user.status,
          }));

          // Announce user left
          socket.to(socket.room).emit("user_left", {
            username: socket.username,
            users: remainingUsers,
            timestamp: new Date().toISOString(),
          });

          // Clean up empty room
          if (rooms[socket.room].length === 0) {
            delete rooms[socket.room];
            // Clean up message history for empty rooms after 1 minute
            setTimeout(
              () => {
                if (!rooms[socket.room] || rooms[socket.room].length === 0) {
                  delete messageHistory[socket.room];
                  console.log(`Cleaned up room: ${socket.room}`);
                }
              },
              1 * 60 * 1000,
            );
          }
        }

        // Clean up user data
        delete users[socket.id];
        delete userLastSeen[socket.id];
        messageRateLimit.delete(socket.id);
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  });

  // Handle connection errors
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Clean up inactive connections periodically
setInterval(
  () => {
    const now = Date.now();
    const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    Object.keys(userLastSeen).forEach((socketId) => {
      if (now - userLastSeen[socketId] > INACTIVE_TIMEOUT) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true);
        }
      }
    });
  },
  5 * 60 * 1000,
); // Check every 5 minutes

// Handle server errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Secure chatroom server running on port ${PORT}`);
  console.log(`📱 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://0.0.0.0:${PORT}`);
  console.log(`📡 For ngrok: ngrok http ${PORT}`);

  // Log active rooms every 30 seconds
  setInterval(() => {
    const roomCount = Object.keys(rooms).length;
    const totalUsers = Object.values(rooms).reduce(
      (sum, room) => sum + room.length,
      0,
    );
    if (roomCount > 0) {
      console.log(`📊 Active rooms: ${roomCount}, Total users: ${totalUsers}`);
    }
  }, 30000);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});

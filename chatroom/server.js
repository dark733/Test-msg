const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// This will store chat users and rooms temporarily in memory
const users = {};
const rooms = {};

// Serve the static HTML file
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (data) => {
        const { username, secretKey } = data;
        if (!username || !secretKey) {
            return;
        }

        socket.join(secretKey);
        socket.username = username;
        socket.room = secretKey;

        // Add user to the room's user list
        if (!rooms[secretKey]) {
            rooms[secretKey] = [];
        }
        rooms[secretKey].push(username);

        // Announce user has joined and update user list
        io.to(secretKey).emit("user joined", {
            username: username,
            users: rooms[secretKey],
        });
        console.log(`${username} joined room: ${secretKey}`);
    });

    socket.on("message", (data) => {
        if (!data.content) {
            return;
        }
        // Broadcast to the same room
        io.to(socket.room).emit("message", {
            username: socket.username,
            content: data.content,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("typing", () => {
        socket.to(socket.room).emit("user typing", { username: socket.username });
    });

    socket.on("stop typing", () => {
        socket.to(socket.room).emit("stop typing");
    });

    socket.on("disconnect", () => {
        if (socket.username && socket.room) {
            console.log(`${socket.username} disconnected`);

            // Remove user from the room's list
            if (rooms[socket.room]) {
                rooms[socket.room] = rooms[socket.room].filter(
                    (user) => user !== socket.username
                );
            }

            // Announce user has left and update user list
            io.to(socket.room).emit("user left", {
                username: socket.username,
                users: rooms[socket.room],
            });

            // If room is empty, remove it
            if (rooms[socket.room] && rooms[socket.room].length === 0) {
                delete rooms[socket.room];
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
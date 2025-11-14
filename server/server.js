// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"], // Frontend URL
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

let users = []; // { socketId, username, room }

// Socket.io events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("user_join", ({ username, room }) => {
    const user = { socketId: socket.id, username, room };
    users.push(user);
    socket.join(room);

    // Notify everyone in room
    io.to(room).emit("user_list", users.filter(u => u.room === room));
    io.to(room).emit("user_joined", user);
  });

  socket.on("send_message", ({ message, room }) => {
    const user = users.find(u => u.socketId === socket.id);
    if (!user) return;
    const payload = {
      id: Date.now(),
      username: user.username,
      message,
      timestamp: new Date().toISOString(),
      private: false
    };
    io.to(room).emit("receive_message", payload);
  });

  socket.on("private_message", ({ to, message }) => {
    const user = users.find(u => u.socketId === socket.id);
    if (!user) return;
    const payload = {
      id: Date.now(),
      username: user.username,
      message,
      timestamp: new Date().toISOString(),
      private: true
    };
    socket.to(to).emit("private_message", payload);
  });

  socket.on("typing", ({ isTyping, room }) => {
    const user = users.find(u => u.socketId === socket.id);
    if (!user) return;
    const typingUsers = users
      .filter(u => u.room === room && u.socketId !== socket.id)
      .map(u => u.username);
    io.to(room).emit("typing_users", isTyping ? typingUsers : []);
  });

  socket.on("disconnect", () => {
    const user = users.find(u => u.socketId === socket.id);
    if (user) {
      users = users.filter(u => u.socketId !== socket.id);
      io.to(user.room).emit("user_list", users.filter(u => u.room === user.room));
      io.to(user.room).emit("user_left", user);
    }
  });
});

server.listen(5000, () => console.log("Socket.io Chat Server running on port 5000"));







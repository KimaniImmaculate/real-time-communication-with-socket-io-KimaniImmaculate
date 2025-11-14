// client/src/socket/socket.js
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const connect = (username, room) => {
    socket.connect();
    socket.emit("user_join", { username, room });
  };

  const disconnect = () => socket.disconnect();

  const sendMessage = (message, room) => {
    socket.emit("send_message", { message, room });
  };

  const sendPrivateMessage = (to, message) => {
    socket.emit("private_message", { to, message });
  };

  const setTyping = (isTyping, room) => {
    socket.emit("typing", { isTyping, room });
  };

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onReceiveMessage = (msg) => setMessages(prev => [...prev, msg]);
    const onPrivateMessage = (msg) => setMessages(prev => [...prev, msg]);

    const onUserList = (list) => setUsers(list);
    const onUserJoined = (user) => setMessages(prev => [
      ...prev,
      { id: Date.now(), system: true, message: `${user.username} joined the room`, timestamp: new Date().toISOString() }
    ]);
    const onUserLeft = (user) => setMessages(prev => [
      ...prev,
      { id: Date.now(), system: true, message: `${user.username} left the room`, timestamp: new Date().toISOString() }
    ]);

    const onTypingUsers = (list) => setTypingUsers(list);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("private_message", onPrivateMessage);
    socket.on("user_list", onUserList);
    socket.on("user_joined", onUserJoined);
    socket.on("user_left", onUserLeft);
    socket.on("typing_users", onTypingUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("private_message", onPrivateMessage);
      socket.off("user_list", onUserList);
      socket.off("user_joined", onUserJoined);
      socket.off("user_left", onUserLeft);
      socket.off("typing_users", onTypingUsers);
    };
  }, []);

  return {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping
  };
};



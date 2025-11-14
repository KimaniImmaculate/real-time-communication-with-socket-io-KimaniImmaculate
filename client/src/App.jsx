import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "./socket/socket";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [privateRecipient, setPrivateRecipient] = useState("");

  const { messages, users, typingUsers, connect, sendMessage, sendPrivateMessage, setTyping } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (privateRecipient) {
      sendPrivateMessage(privateRecipient, message);
    } else {
      sendMessage(message, room);
    }

    setMessage("");
    setTyping(false, room);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0, room);
  };

  if (!joined) {
    return (
      <div className="app">
        <div className="login">
          <h2>Join the Chat</h2>
          <input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="general">General</option>
            <option value="tech">Tech</option>
            <option value="gaming">Gaming</option>
          </select>
          <button
            onClick={() => {
              if (username.trim() !== "") {
                connect(username, room);
                setJoined(true);
              }
            }}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">

        {/* SIDEBAR */}
        <div className="sidebar">
          <h3>Online Users</h3>
          {users.map(u => (
            <div key={u.socketId}>{u.username}</div>
          ))}

          {typingUsers.length > 0 && (
            <p style={{ marginTop: 20, color: "#4A90E2" }}>
              {typingUsers.join(", ")} typing...
            </p>
          )}

          <h3 style={{ marginTop: 30 }}>Private Message:</h3>
          <select onChange={(e) => setPrivateRecipient(e.target.value)}>
            <option value="">Everyone</option>
            {users
              .filter(u => u.username !== username)
              .map(u => (
                <option key={u.socketId} value={u.socketId}>
                  {u.username}
                </option>
              ))}
          </select>
        </div>

        {/* CHAT */}
        <div className="chat">
          <div className="messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message ${
                  m.system
                    ? "system"
                    : m.username === username
                    ? "self"
                    : "other"
                } ${m.private ? "private" : ""}`}
              >
                {!m.system && <b>{m.username}: </b>}
                {m.message}
                <span className="timestamp">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input">
            <input
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;




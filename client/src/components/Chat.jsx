import React from "react";
import { useSocket } from "../socket/socket";
import Message from "./Message";

function Chat({ username }) {
  const { messages, sendMessage, setTyping } = useSocket();

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m) => <Message key={m.id} message={m} />)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(e.target[0].value); e.target[0].value = ""; }}>
        <input type="text" onChange={(e) => setTyping(e.target.value.length > 0)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;

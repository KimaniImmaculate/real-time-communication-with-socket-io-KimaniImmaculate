import React from "react";

function Message({ message }) {
  return (
    <div className={`message ${message.system ? "system" : ""}`}>
      <strong>{message.sender || message.username || "System"}</strong>: {message.message || message.msg}
    </div>
  );
}

export default Message;

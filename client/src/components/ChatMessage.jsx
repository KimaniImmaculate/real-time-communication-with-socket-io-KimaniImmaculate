import React from 'react';

const ChatMessage = ({ message }) => {
  if (message.system) {
    return <div className="system-message">{message.message}</div>;
  }
  return (
    <div className="chat-message">
      <strong>{message.sender}:</strong> {message.message}
    </div>
  );
};

export default ChatMessage;

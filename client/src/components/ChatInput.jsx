import React, { useState, useEffect } from 'react';

const ChatInput = ({ sendMessage, setTyping }) => {
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
    setTyping(false);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    setTyping(true);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => setTyping(false), 1500);
    setTypingTimeout(timeout);
  };

  useEffect(() => () => { if (typingTimeout) clearTimeout(typingTimeout); }, [typingTimeout]);

  return (
    <form onSubmit={handleSend} className="chat-input">
      <input value={message} onChange={handleChange} placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;

import React, { useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';
import '../styles/Chat.scss';

function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = (msg: string) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="chat-page">
      <h1>Chat Room</h1>
      <ChatMessages messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default Chat;

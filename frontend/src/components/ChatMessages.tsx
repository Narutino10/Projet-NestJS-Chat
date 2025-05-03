import React from 'react';
import '../styles/ChatMessages.scss';

interface Props {
  messages: string[];
}

function ChatMessages({ messages }: Props) {
  return (
    <div className="chat-messages">
      {messages.map((msg, idx) => (
        <div key={idx} className="chat-message">
          {msg}
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;

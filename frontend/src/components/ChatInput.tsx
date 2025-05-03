import React, { useState } from 'react';
import '../styles/ChatInput.scss'; 
interface Props {
  onSend: (msg: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-input">
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;

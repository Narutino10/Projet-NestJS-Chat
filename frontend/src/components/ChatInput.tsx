import React, { useState } from 'react';
import '../styles/ChatInput.scss';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping: () => void;
}

  const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping();  // ➜ on signale qu’on tape
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Tapez votre message..."
      />
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default ChatInput;

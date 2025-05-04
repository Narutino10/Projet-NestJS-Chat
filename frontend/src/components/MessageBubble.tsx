import React from 'react';
import '../styles/MessageBubble.scss';

interface MessageBubbleProps {
  sender: string;
  message: string;
  color: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message, color }) => {
  return (
    <div className="message-bubble" style={{ borderColor: color }}>
      <strong>{sender} :</strong> <span>{message}</span>
    </div>
  );
};

export default MessageBubble;

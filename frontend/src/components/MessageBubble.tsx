import React from 'react';
import '../styles/MessageBubble.scss';

interface MessageBubbleProps {
  sender: string;
  message: string;
  color: string;
  isMine: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message, color, isMine }) => {
  return (
    <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
      <div className="bubble-content" style={{ backgroundColor: isMine ? '#d6b4fc' : '#e0e0e0' }}>
        <strong>{sender} :</strong> <span>{message}</span>
      </div>
    </div>
  );
};

export default MessageBubble;

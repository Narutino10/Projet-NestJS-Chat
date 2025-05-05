import React from 'react';
import '../styles/MessageBubble.scss';

interface MessageBubbleProps {
  sender: string;
  message: string;
  color: string;
  isMine: boolean;
  avatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, message, color, isMine, avatar }) => {
  return (
    <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && avatar && <img src={avatar} alt="avatar" className="avatar" />}
      <div className="bubble-content" style={{ backgroundColor: color }}>
        <strong>{sender} :</strong> <span>{message}</span>
      </div>
      {isMine && avatar && <img src={avatar} alt="avatar" className="avatar" />}
    </div>
  );
};

export default MessageBubble;

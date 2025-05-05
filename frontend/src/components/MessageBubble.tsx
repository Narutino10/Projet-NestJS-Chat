import React from 'react';
import '../styles/MessageBubble.scss';

interface MessageBubbleProps {
  sender: string;
  message: string;
  color: string;
  isMine: boolean;
  avatar: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  message,
  color,
  isMine,
  avatar,
}) => {
  const avatarSrc = avatar ? `/avatars/${avatar}` : '/avatars/avatar1.png';

  return (
    <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && <img className="avatar" src={avatarSrc} alt="avatar" />}
      <div
        className="bubble-content"
        style={{ backgroundColor: isMine ? color : undefined }}
      >
        <strong>{sender} :</strong> <span>{message}</span>
      </div>
      {isMine && <img className="avatar" src={avatarSrc} alt="avatar" />}
    </div>
  );
};

export default MessageBubble;

import React from 'react';
import '../styles/MessageBubble.scss';

interface Reaction {
  emoji: string;
  count: number;
}

interface MessageBubbleProps {
  sender: string;
  message: string;
  color: string;
  isMine: boolean;
  avatar: string;
  messageId: number;
  onReact: (messageId: number, emoji: string) => void;
  reactions: Reaction[];
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  message,
  color,
  isMine,
  avatar,
  messageId,
  onReact,
  reactions,
}) => {
  const avatarSrc = avatar ? `/avatars/${avatar}` : '/avatars/avatar1.png';

  return (
    <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && <img className="avatar" src={avatarSrc} alt="avatar" />}
      <div className="bubble-content" style={{ backgroundColor: isMine ? color : undefined }}>
        <strong>{sender} :</strong> <span>{message}</span>
        <div className="reactions">
          {reactions.map((r, index) => (
            <span key={index}>{r.emoji} {r.count}</span>
          ))}
        </div>
        <div className="reaction-buttons">
          <button onClick={() => onReact(messageId, '❤️')}>❤️</button>
          <button onClick={() => onReact(messageId, '👍')}>👍</button>
          <button onClick={() => onReact(messageId, '😂')}>😂</button>
        </div>
      </div>
      {isMine && <img className="avatar" src={avatarSrc} alt="avatar" />}
    </div>
  );
};

export default MessageBubble;

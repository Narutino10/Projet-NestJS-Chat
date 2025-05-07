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

  const handleReactionClick = (emoji: string) => {
    onReact(messageId, emoji);
  };

  return (
    <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && <img className="avatar" src={avatarSrc} alt="avatar" />}
      <div className="bubble-content" style={{ backgroundColor: isMine ? color : undefined }}>
        <strong>{sender} :</strong> <span>{message}</span>

        {/* Affichage des réactions existantes */}
        <div className="reactions">
          {reactions.length > 0 &&
            reactions.map((r, index) => (
              <span key={index} className="reaction">
                {r.emoji} {r.count}
              </span>
            ))}
        </div>

        {/* Boutons cliquables */}
        <div className="reaction-buttons">
          {['❤️', '👍', '😂'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              className="reaction-button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      {isMine && <img className="avatar" src={avatarSrc} alt="avatar" />}
    </div>
  );
};

export default MessageBubble;

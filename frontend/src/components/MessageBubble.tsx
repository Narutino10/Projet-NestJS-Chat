import React from 'react';
import '../styles/MessageBubble.scss';

interface Props {
  sender: string;
  message: string;
  color: string;
}

const MessageBubble: React.FC<Props> = ({ sender, message, color }) => (
  <div className="message-bubble" style={{ borderLeft: `4px solid ${color}` }}>
    <strong>{sender}:</strong> {message}
  </div>
);

export default MessageBubble;

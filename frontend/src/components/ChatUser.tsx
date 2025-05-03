import React from 'react';
import '../styles/ChatUser.scss';

interface Props {
  username: string;
  color: string;
}

function ChatUser({ username, color }: Props) {
  return (
    <div className="chat-user" style={{ color }}>
      {username}
    </div>
  );
}

export default ChatUser;

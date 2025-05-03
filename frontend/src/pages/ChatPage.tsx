import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import UserList from '../components/UserList';
import '../styles/ChatPage.scss';

interface Message {
  sender: string;
  message: string;
  color: string;
}

const socket: Socket = io('http://localhost:3000');

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('users', (userList: string[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('users');
    };
  }, []);

  const handleSend = (msg: string) => {
    socket.emit('message', { message: msg, color: 'blue' });
  };

  return (
    <div className="chat-page">
      <div className="sidebar">
        <UserList users={users} />
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map((m, index) => (
            <MessageBubble key={index} sender={m.sender} message={m.message} color={m.color} />
          ))}
        </div>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatPage;

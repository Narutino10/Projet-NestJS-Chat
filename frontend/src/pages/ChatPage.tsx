import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must log in first.');
      navigate('/login');
      return;
    }

    const newSocket = io('http://localhost:3000', {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('users', (userList: string[]) => {
      setUsers(userList);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  const handleSend = (msg: string) => {
    socket?.emit('message', { message: msg, color: 'blue' });
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

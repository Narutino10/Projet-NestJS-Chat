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

interface User {
  id: string;
  username: string;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez vous connecter d’abord.');
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

    newSocket.on('users', (userList: User[]) => {
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

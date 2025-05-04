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
  timestamp: string;
}

interface User {
  id: string;
  username: string;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [room, setRoom] = useState<string>('general');

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch((err) => console.error('Erreur lecture son:', err));
  };

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

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
      newSocket.emit('joinRoom', { room });
    });

    newSocket.on('message', (msg: Message) => {
      console.log('📩 Nouveau message reçu :', msg);
      playNotificationSound();
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('users', (userList: User[]) => {
      console.log('👥 Liste des utilisateurs reçue :', userList);
      setUsers(userList);
    });

    newSocket.on('typing', (data: { username: string }) => {
      console.log('✏️ Utilisateur en train d’écrire :', data.username);
      setTypingUser(data.username);
      setTimeout(() => setTypingUser(null), 3000);
    });

    newSocket.on('disconnect', () => {
      console.warn('⚠️ Déconnecté du serveur WebSocket');
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion WebSocket :', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, room]);

  const handleSend = (msg: string) => {
    if (socket) {
      console.log('✉️ Envoi du message :', msg);
      socket.emit('message', {
        room,
        message: msg,
        color: 'blue',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { room });
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoom = e.target.value;
    setRoom(newRoom);
    setMessages([]);
    if (socket) {
      socket.emit('joinRoom', { room: newRoom });
    }
  };

  return (
    <div className="chat-page">
      <div className="sidebar">
        <h3>Choisir une room</h3>
        <select value={room} onChange={handleRoomChange}>
          <option value="general">Général</option>
          <option value="sport">Sport</option>
          <option value="musique">Musique</option>
        </select>
        <UserList users={users} />
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map((m, index) => (
            <div key={index}>
              {m.sender === 'System' ? (
                <div className="system-message">{m.message}</div>
              ) : (
                <MessageBubble
                  sender={`${m.sender} (${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                  message={m.message}
                  color={m.color}
                />
              )}
            </div>
          ))}
        </div>
        <ChatInput onSend={handleSend} onTyping={handleTyping} />
        {typingUser && (
          <div className="typing-indicator">
            <p>{typingUser} est en train d’écrire...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

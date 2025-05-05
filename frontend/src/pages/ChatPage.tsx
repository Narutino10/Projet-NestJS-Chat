import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import UserList from '../components/UserList';
import UserProfileSettings from '../components/UserProfileSettings';
import '../styles/ChatPage.scss';

interface Message {
  sender: string;
  message: string;
  color: string;
  timestamp: string;
}

interface User {
  username: string;
  status: string;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [room, setRoom] = useState<string>('general');
  const [privateChatUser, setPrivateChatUser] = useState<string | null>(null);
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [unreadPrivateMessages, setUnreadPrivateMessages] = useState<{ [username: string]: number }>({});

  const [avatar, setAvatar] = useState<string>('https://via.placeholder.com/40'); // default avatar
  const [bubbleColor, setBubbleColor] = useState<string>('#7289da');
  const [pageColor, setPageColor] = useState<string>('#fafafa');

  const token = localStorage.getItem('token');
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setCurrentUsername(decodedPayload.username);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        navigate('/login');
      }
    } else {
      alert('Vous devez vous connecter d’abord.');
      navigate('/login');
    }
  }, [navigate, token]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch((err) => console.error('Erreur lecture son:', err));
  };

  useEffect(() => {
    if (!token) return;

    const newSocket = io('http://localhost:3000', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
      newSocket.emit('joinRoom', { room });
    });

    newSocket.on('message', (msg: Message) => {
      playNotificationSound();
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('privateMessage', (msg: Message & { sender: string }) => {
      playNotificationSound();

      if (msg.sender !== privateChatUser) {
        setUnreadPrivateMessages((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }

      if (msg.sender !== currentUsername) {
        setPrivateMessages((prev) => [...prev, {
          sender: msg.sender,
          message: msg.message,
          color: 'gray',
          timestamp: msg.timestamp,
        }]);
      }
    });

    newSocket.on('users', (userList: User[]) => {
      setUsers(userList);
    });

    newSocket.on('typing', (data: { username: string }) => {
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
  }, [room, privateChatUser, token, currentUsername]);

  const handleSend = useCallback(
    (msg: string) => {
      if (!socket) return;

      if (privateChatUser) {
        socket.emit('privateMessage', {
          receiverUsername: privateChatUser,
          message: msg,
          color: bubbleColor,
        });
        setPrivateMessages((prev) => [
          ...prev,
          {
            sender: 'Moi',
            message: msg,
            color: bubbleColor,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        socket.emit('message', {
          room,
          message: msg,
          color: bubbleColor,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [socket, privateChatUser, room, bubbleColor],
  );

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { room });
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoom = e.target.value;
    setRoom(newRoom);
    setMessages([]);
    setPrivateChatUser(null);
    if (socket) {
      socket.emit('joinRoom', { room: newRoom });
    }
  };

  const handleSendPrivate = (username: string) => {
    setPrivateChatUser(username);
    setPrivateMessages([]);
    setUnreadPrivateMessages((prev) => ({
      ...prev,
      [username]: 0,
    }));

    if (socket) {
      socket.emit('getPrivateHistory', { withUser: username });
      socket.once('privateHistory', (messages: any[]) => {
        setPrivateMessages(messages.map((msg) => ({
          sender: msg.sender === currentUsername ? 'Moi' : msg.sender,
          message: msg.message,
          color: msg.sender === currentUsername ? bubbleColor : 'gray',
          timestamp: msg.timestamp,
        })));
      });
    }
  };

  const handleProfileUpdate = (newAvatar: string, newColor: string) => {
    setAvatar(newAvatar);
    setBubbleColor(newColor);
    setPageColor(newColor + '33'); // lightened page background
  };

  return (
    <div className="chat-page" style={{ backgroundColor: pageColor }}>
      <div className="sidebar">
        <UserProfileSettings onUpdate={handleProfileUpdate} />

        <h3>Choisir une room</h3>
        <select value={room} onChange={handleRoomChange}>
          <option value="general">Général</option>
          <option value="sport">Sport</option>
          <option value="musique">Musique</option>
        </select>
        <UserList
          users={users}
          onSendPrivate={handleSendPrivate}
          unreadPrivateMessages={unreadPrivateMessages}
          currentUsername={currentUsername}
        />
      </div>

      <div className="chat-area">
        {privateChatUser ? (
          <div className="private-chat">
            <h4>DM avec {privateChatUser}</h4>
            <div className="messages">
              {privateMessages.map((m, index) => (
                <MessageBubble
                  key={index}
                  sender={`${m.sender} (${new Date(m.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })})`}
                  message={m.message}
                  color={m.color}
                  isMine={m.sender === 'Moi'}
                  avatar={avatar}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((m, index) => (
              <div key={index}>
                {m.sender === 'System' ? (
                  <div className="system-message">{m.message}</div>
                ) : (
                  <MessageBubble
                    sender={`${m.sender} (${new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })})`}
                    message={m.message}
                    color={m.color}
                    isMine={m.sender === currentUsername}
                    avatar={avatar}
                  />
                )}
              </div>
            ))}
          </div>
        )}

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

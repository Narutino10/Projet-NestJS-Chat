import React from 'react';
import '../styles/UserList.scss';

interface User {
  username: string;
  status: string; // 'online' ou 'offline'
}

interface UserListProps {
  users: User[];
  onSendPrivate: (username: string) => void;
  unreadPrivateMessages: { [username: string]: number };
  currentUsername: string | null;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onSendPrivate,
  unreadPrivateMessages,
  currentUsername,
}) => {
  return (
    <div className="user-list">
      <h3>Utilisateurs</h3>
      {users.length === 0 ? (
        <p>Aucun utilisateur enregistré</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index} className={user.status}>
              <span className={`status-dot ${user.status === 'online' ? 'online' : 'offline'}`} />
              {user.username === currentUsername ? 'Moi' : user.username}
              {unreadPrivateMessages[user.username] > 0 && (
                <span className="badge">{unreadPrivateMessages[user.username]} non lu(s)</span>
              )}
              <button
                onClick={() => onSendPrivate(user.username)}
                disabled={user.status !== 'online'}
              >
                DM
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;

import React from 'react';
import '../styles/UserList.scss';

interface User {
  id: string;
  username: string;
}

interface UserListProps {
  users: User[];
  onSendPrivate: (username: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onSendPrivate }) => {
  return (
    <div className="user-list">
      <h3>Utilisateurs en ligne</h3>
      {users.length === 0 ? (
        <p>Aucun utilisateur en ligne</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username}
              <button onClick={() => onSendPrivate(user.username)}>DM</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;

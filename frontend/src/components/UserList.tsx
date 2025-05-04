import React from 'react';
import '../styles/UserList.scss';

interface User {
  id: string;
  username: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="user-list">
      <h3>Utilisateurs en ligne</h3>
      {users.length === 0 ? (
        <p>Aucun utilisateur en ligne</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;

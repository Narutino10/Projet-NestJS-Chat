import React, { useState } from 'react';
import '../styles/UserProfileSettings.scss';

interface UserProfileSettingsProps {
  onUpdate: (avatar: string, color: string) => void;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ onUpdate }) => {
  const [avatar, setAvatar] = useState('avatar1.png');
  const [color, setColor] = useState('#7289da');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(avatar, color);
  };

  return (
    <div className="user-profile-settings">
      <h4>Personnalisation</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Choisir un avatar:</label>
          <select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
            <option value="avatar1.png">Avatar 1</option>
            <option value="avatar2.png">Avatar 2</option>
            <option value="avatar3.png">Avatar 3</option>
            <option value="avatar4.png">Avatar 4</option>
          </select>
        </div>
        <div className="form-group">
          <label>Choisir une couleur de bulle:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UserProfileSettings;

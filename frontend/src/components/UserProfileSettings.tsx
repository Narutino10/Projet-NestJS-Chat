import React, { useState, useEffect } from 'react';
import '../styles/UserProfileSettings.scss';

interface UserProfileSettingsProps {
  onUpdate: (avatar: string, color: string) => void;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ onUpdate }) => {
  const [avatar, setAvatar] = useState('');
  const [color, setColor] = useState('#7289da');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(avatar, color);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
      <h4>Personnalisation</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Avatar (URL): </label>
          <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>
        <div>
          <label>Couleur: </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UserProfileSettings;

import React, { useState, useEffect } from 'react';
import '../styles/UserProfileSettings.scss';

interface UserProfileSettingsProps {
  currentAvatar: string;
  currentColor: string;
  onSave: (avatar: string, color: string) => void;
}

const availableAvatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  currentAvatar,
  currentColor,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [selectedColor, setSelectedColor] = useState(currentColor);

  useEffect(() => {
    setSelectedAvatar(currentAvatar);
    setSelectedColor(currentColor);
  }, [currentAvatar, currentColor]);

  const handleSave = () => {
    onSave(selectedAvatar, selectedColor);
  };

  return (
    <div className="user-profile-settings">
      <h3>Personnalisation de mon profil</h3>

      <div className="section">
        <h4>Choisir un avatar :</h4>
        <div className="avatar-selection">
          {availableAvatars.map((avatar) => (
            <img
              key={avatar}
              src={avatar}
              alt="avatar"
              className={selectedAvatar === avatar ? 'selected' : ''}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <h4>Choisir une couleur :</h4>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </div>

      <button onClick={handleSave}>Enregistrer</button>
    </div>
  );
};

export default UserProfileSettings;

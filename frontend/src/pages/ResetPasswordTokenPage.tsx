import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPasswordTokenPage.scss';

const ResetPasswordTokenPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Mot de passe mis à jour avec succès.');
      navigate('/login');
    } else {
      setMessage(data.error || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="reset-password-token-page">
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Mettre à jour</button>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordTokenPage;

import React, { useState } from 'react';
import '../styles/ResetPasswordPage.scss';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3000/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('📧 Un lien de réinitialisation a été envoyé à votre email.');
      } else {
        const data = await response.json();
        setError(data.message || 'Erreur lors de la réinitialisation.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  return (
    <div className="reset-password-page">
      <form onSubmit={handleSubmit}>
        <h2>🔑 Réinitialisation du mot de passe</h2>
        <input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;

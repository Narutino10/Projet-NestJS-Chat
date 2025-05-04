import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.scss';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    if (res.ok) {
      alert('Compte créé avec succès ! Connecte-toi.');
      navigate('/login');
    } else {
      alert('Erreur lors de la création du compte.');
    }
  };

  return (
    <div className="register-page">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom d’utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Créer un compte</button>
      </form>
      <p>
        Tu as déjà un compte ? <Link to="/login">Connecte-toi ici</Link>
      </p>
    </div>
  );
};

export default RegisterPage;

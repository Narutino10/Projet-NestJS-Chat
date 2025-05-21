import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      
      // On décode le JWT pour extraire le username
      const base64Url = data.access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));
      const username = decodedPayload.username;
    
      localStorage.setItem('username', username);
      
      alert(`Login successful! Bienvenue ${username}`);
      navigate('/chat');
    } else {
      alert('Login failed. Please check your credentials.');
    }
    
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
        <p className='forgot-password'>
          Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
        </p>
        <p className='forgot-password'>
          Mot de passe oublié ? <a href="/reset-password">Réinitialiser</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

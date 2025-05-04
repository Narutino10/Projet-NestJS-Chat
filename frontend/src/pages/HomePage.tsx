import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Bienvenue sur l’application de chat</h1>
      <p>Discutez en temps réel avec vos amis !</p>
      <div className="buttons">
        <Link className="button" to="/login">
          Se connecter
        </Link>
        <Link className="button" to="/register">
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

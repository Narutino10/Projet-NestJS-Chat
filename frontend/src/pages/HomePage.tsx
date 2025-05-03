import React from 'react';
import '../styles/HomePage'; 
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="home-page">
    <h1>Welcome to the Chat App</h1>
    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
  </div>
);

export default HomePage;

import React from 'react';
import './LoginPage.scss';

const LoginPage = () => {
  return (
    <div className="login-page">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import '../styles/RegisterPage.scss';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

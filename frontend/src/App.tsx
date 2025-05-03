import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/chat">Chat</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;

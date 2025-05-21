import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

export default function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <Chat user={user} />
  ) : (
    <Login onLogin={setUser} />
  );
}

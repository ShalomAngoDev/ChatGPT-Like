import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { styles } from '../styles';

const LOGIN = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`;

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginQuery, { loading }] = useLazyQuery(LOGIN, {
    onCompleted: (data) => {
      if (data.login) {
        onLogin(data.login);
      } else {
        alert('Identifiants incorrects');
      }
    },
    onError: () => alert('Erreur lors de la connexion'),
  });

  const handleSubmit = () => {
    if (!username || !password) {
      alert('Merci de remplir tous les champs');
      return;
    }
    loginQuery({ variables: { username, password } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={{ marginBottom: 20, color: '#4a90e2' }}>
          Bienvenue sur ChatGPT Like
        </h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  );
}

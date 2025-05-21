import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

const LOGIN = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`;

const GET_CONVERSATIONS = gql`
  query GetConversations($userId: ID!) {
    getConversations(userId: $userId) {
      id
      messages {
        from
        text
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($userId: ID!, $text: String!) {
    sendMessage(userId: $userId, text: $text) {
      id
      messages {
        from
        text
      }
    }
  }
`;

export default function ChatPage() {
  const [username, setUsername] = useState('test');
  const [password, setPassword] = useState('test123');
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const { refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { userId: user?.id || '' },
    skip: !user,
    onCompleted: (data) => {
      setMessages(data.getConversations[0].messages);
    }
  });

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setUser(data.login);
    }
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      setMessages(data.sendMessage.messages);
    }
  });

  const handleLogin = () => {
    login({ variables: { username, password } });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ variables: { userId: user.id, text: input } });
    setInput('');
  };

  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <input value={password} type="password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Bienvenue, {user.username}</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.from}:</strong> {msg.text}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend}>Envoyer</button>
    </div>
  );
}

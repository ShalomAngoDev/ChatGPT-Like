import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { styles } from '../styles';

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

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const [getConversations] = useLazyQuery(GET_CONVERSATIONS, {
    onCompleted: (data) => {
      setMessages(data.getConversations[0]?.messages || []);
    },
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      setMessages(data.sendMessage.messages);
    },
  });

  useEffect(() => {
    getConversations({ variables: { userId: user.id } });
  }, [getConversations, user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ variables: { userId: user.id, text: input } });
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <header style={styles.header}>
          <h2 style={{ color: 'white' }}>ChatGPT Like</h2>
          <div style={{ fontSize: 14, opacity: 0.8, color: 'white' }}>
            Connecté en tant que <strong>{user.username}</strong>
          </div>
        </header>

        <div style={styles.messagesContainer}>
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>
              Commencez la conversation !
            </p>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.from === 'user';
            return (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  backgroundColor: isUser ? '#4a90e2' : '#e1e1e1',
                  color: isUser ? 'white' : 'black',
                  borderTopRightRadius: isUser ? 0 : 15,
                  borderTopLeftRadius: isUser ? 15 : 0,
                }}
              >
                {msg.text}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={styles.inputContainer}
        >
          <textarea
            style={styles.textarea}
            rows={1}
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={sending}
          />
          <button
            type="submit"
            style={styles.sendButton}
            disabled={sending || !input.trim()}
          >
            {sending ? '...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
}

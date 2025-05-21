const { gql } = require('apollo-server-express');

module.exports = gql`
  type Message {
    from: String
    text: String
  }

  type Conversation {
    id: ID
    messages: [Message]
  }

  type User {
    id: ID
    username: String
    conversations: [Conversation]
  }

  type Query {
    login(username: String!, password: String!): User
    getConversations(userId: ID!): [Conversation]
  }

  type Mutation {
    sendMessage(userId: ID!, text: String!): Conversation
  }
`;

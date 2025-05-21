const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers/resolvers');
const cors = require('cors');

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();

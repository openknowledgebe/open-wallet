/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cookieParser = require('cookie-parser');

const typeDefs = require('./graphql/types');
const Query = require('./graphql/resolvers/queries');
const Mutation = require('./graphql/resolvers/mutations');
const schemaDirectives = require('./graphql/directives');

const models = require('./models');
const db = require('./db');
const auth = require('./auth');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser());

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation
  },
  schemaDirectives,
  context: async ({ req, res }) => {
    const user = await auth.loggedUser(req.cookies, models);
    // adopting injection pattern to ease mocking
    return { req, res, user, auth, models };
  },
  mocks: false
});

if (process.env.NODE_ENV !== 'test') {
  // only start if not in test env
  // see test folder for test server config
  server.applyMiddleware({ app });
  db.connect();

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

module.exports = {
  models,
  typeDefs,
  // TODO exports resolvers in their on folder via index
  resolvers: {
    Query,
    Mutation
  },
  schemaDirectives,
  db,
  auth,
  server,
  app
};

/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cookieParser = require('cookie-parser');

const typeDefs = require('./graphql/types');
const Query = require('./graphql/resolvers/queries');
const Mutation = require('./graphql/resolvers/mutations');

const { loggedUser } = require('./auth');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser());

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation
  },
  context: async ({ req, res }) => {
    const user = await loggedUser(req);
    return { req, res, user };
  },
  mocks: false
});

server.applyMiddleware({ app });

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true
  })
  .then(() => console.log('DB connected successfully!'))
  .catch(err => {
    console.log(`DB connection failed: ${err}`);
  });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

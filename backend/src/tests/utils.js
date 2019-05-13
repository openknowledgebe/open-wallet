/* eslint-disable import/no-extraneous-dependencies */

/**
 * inspired by: https://github.com/apollographql/fullstack-tutorial/blob/master/final/server/src/__tests__/__utils.js
 */

const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { execute, toPromise } = require('apollo-link');

module.exports.toPromise = toPromise;

const {
  context: defaultContext,
  typeDefs,
  resolvers,
  ApolloServer,
  app,
  models,
  schemaDirectives
} = require('../');

/**
 * Integration testing utils
 */
const constructTestServer = ({ context = defaultContext } = {}) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context
  });

  return server;
};

module.exports.constructTestServer = constructTestServer;

/**
 * e2e Testing Utils
 */

const startTestServer = async server => {
  server.applyMiddleware({ app });
  const httpServer = await app.listen(0);

  const uri = `http://localhost:${httpServer.address().port}${server.graphqlPath}`;

  const link = new HttpLink({
    uri,
    fetch
  });

  const executeOperation = ({ query, variables = {} }) => execute(link, { query, variables });

  return {
    link,
    uri,
    stop: () => {
      httpServer.close();
    },
    graphql: executeOperation
  };
};

module.exports.startTestServer = startTestServer;

/**
 * Cleans the database.
 */
const clean = async () => {
  const { User, Transaction, Company, Counter } = models;
  await User.deleteMany({});
  await Transaction.deleteMany({});
  await Company.deleteMany({});
  await Counter.deleteMany({});
};

/**
 * Populates the database with mock data.
 */
const populate = async () => {
  const { User } = models;

  await User({
    name: 'John Doe',
    email: 'john.doe@john.com',
    password: 'johnnyyyyy'
  }).save();
  await User({
    name: 'Sylvie Delcourt',
    email: 'Sylvie@hotmail.com',
    password: 'sylvie2324'
  }).save();
  await User({
    name: 'Mitch Mitch',
    email: 'mitchell@gmail.com',
    password: 'mitchelll'
  }).save();
};

module.exports.populate = populate;
module.exports.clean = clean;

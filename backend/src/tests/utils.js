/* eslint-disable import/no-extraneous-dependencies */
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

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.address().port}${server.graphqlPath}`,
    fetch
  });

  const executeOperation = ({ query, variables = {} }) => execute(link, { query, variables });

  return {
    link,
    stop: async () => {
      httpServer.close();
    },
    graphql: executeOperation
  };
};

module.exports.startTestServer = startTestServer;

// populate database

const populate = async () => {
  const { User } = models;
  const count = await User.countDocuments();
  if (!count) {
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
  }
};

// clean database
const clean = async () => {
  const { User, Transaction } = models;
  await User.remove({});
  await Transaction.remove({});
};

module.exports.populate = populate;
module.exports.clean = clean;

require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const typeDefs = require("./graphql/types");
const Query = require("./graphql/resolvers/queries");

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query
  },
  mocks: true,
});

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true
  })
  .then(() => console.log("DB connected successfully!"))
  .catch(err => {
    console.log(`DB connection failed: ${err}`);
  });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

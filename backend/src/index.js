require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const typeDefs = require("./graphql/types");

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () =>
      fetch("https://fourtonfish.com/hellosalut/?mode=auto")
        .then(res => res.json())
        .then(data => data.hello)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  onHealthCheck: () => fetch("https://fourtonfish.com/hellosalut/?mode=auto")
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

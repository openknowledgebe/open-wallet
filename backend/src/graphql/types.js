const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    getUsers: [User]!
  }
  type Mutation {
    register(firstName: String!, lastName: String!, email: String!, password: String!): User
  }
  type Address {
    street: String!
    city: String!
    country: String!
    zipCode: Int!
  }

  type BankDetails {
    iban: String!
    bic: String
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    password: String
    email: String!
    bankDetails: BankDetails
    address: Address
  }
`;

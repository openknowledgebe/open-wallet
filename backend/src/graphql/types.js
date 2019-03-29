const { gql } = require('apollo-server-express');

module.exports = gql`
  # types

  type Query {
    users: [User]!
    me: User
    logout: Succes!
    login(email: String!, password: String!): User!
  }
  type Mutation {
    register(user: UserInput!): User!
  }
  type Success {
    status: Boolean!
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
    name: String!
    email: String!
    bankDetails: BankDetails
    address: Address
  }

  #inputs
  input AdressInput {
    street: String!
    city: String!
    country: String!
    zipCode: Int!
  }

  input BankDetailsInput {
    iban: String!
    bic: String
  }

  input UserInput {
    name: String!
    password: String!
    email: String!
    bankDetails: BankDetailsInput
    address: AdressInput
  }
`;

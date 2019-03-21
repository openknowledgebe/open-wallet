const { gql } = require("apollo-server");

module.exports = gql`
  # types

  type Query {
    getUsers: [User]!
  }
  type Mutation {
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      address: Address
      bankDetails: BankDetails
    ): User
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
    firstName: String!
    lastName: String!
    password: String!
    email: String!
    bankDetails: BankDetailsInput
    address: AdressInput
  }
`;

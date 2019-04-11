const { gql } = require('apollo-server-express');

module.exports = gql`
  directive @constraint(
    format: String
    maxLength: Int
    minLength: Int
    required: Boolean
  ) on INPUT_FIELD_DEFINITION
  directive @guest on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
  # types

  type Query {
    users: [User]! @auth
    me: User @auth
  }
  type Mutation {
    register(user: UserInput!): User! @guest
    logout: Boolean!
    login(email: String!, password: String!): User! @guest
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
    street: String! @constraint(required: true)
    city: String! @constraint(required: true)
    country: String! @constraint(required: true)
    zipCode: Int!
  }

  input BankDetailsInput {
    iban: String!
    bic: String
  }

  input UserInput {
    name: String! @constraint(required: true)
    password: String! @constraint(minLength: 8)
    email: String! @constraint(format: "email")
    bankDetails: BankDetailsInput
    address: AdressInput
  }
`;
